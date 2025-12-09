---
title: "The Python GIL: A Love-Hate Story (That’s Mostly Hate) and Its Wild New Ending"
date: "2025-12-07"
description: "The Global Interpreter Lock—Python’s infamous boogeyman. The reason your brand new 32-core CPU looks at your intense Python number-crunching script, uses 4% of its power on one core, and goes back to sleep."
tags: ["Python"]
author: "Bao Huynh"
readTime: "10 min read"
---

# The Python GIL: A Love-Hate Story (That’s Mostly Hate) and Its Wild New Ending

If you’ve been hanging around the Python watercooler long enough, you’ve heard the whispers. You’ve seen the frustrated Stack Overflow posts. You’ve mentioned "multithreading" at a party and watched a senior engineer stare blankly into the middle distance while clutching their drink

> They are traumatized by the **GIL**.

![The Python GIL Trade Deal](https://i.programmerhumor.io/2025/03/e87fd242dd6e3dfc15e54d607a83d9fc73bcb91a17858b2535c97c56a54a8d95.jpeg)

## What is GIL, anyway?

The GIL is basically a gate keeper to the Python interpreter’s VIP section (where the bytecode gets executed).

It doesn’t matter how many threads you spawn. It doesn’t matter how many cores your expensive gaming rig has. The rule is simple: **Only one thread can executes at a time.**

![How GIL works](https://towardsdatascience.com/wp-content/uploads/2024/02/1s3X8cnM8VZPqE5FqoKWR2w.png)

If **Thread 1** has the "key", it gets to run Python code. **Thread 2** has to stand outside, waiting for its turn. Every few milliseconds, the interpreter yells "SWITCH!", **Thread 1** drops the "key", and other threads scrambles to grab it next.

## The "Why do we need the GIL?" Memory Safety

So, why cripple a language like this? Was Guido just having a bad day in 1991?

No. The GIL exists because of how Python handles memory, specifically something called **Reference Counting**.

Every single thing in Python—an integer, a string, a list—has a secret number attached to it called `ob_refcnt` (Object Reference Count).

- We declare variable `x = [1,2,3]`, the `ob_refcnt` is **1**.
- Assign `y = x`, the `ob_refcnt` goes to **2**.
- Then `del x`, the `ob_refcnt` drops to **1**.
- If the `ob_refcnt` hits **0**, Python deletes the object from memory.

### The "Race Condition" Nightmare

Imagine two threads, **Thread A** and **Thread B**, are both finishing using the same object at the exact same time. The reference count is currently 2.

1. **Thread A** reads the ref count: `2`.
2. _Context Switch happens_.
3. **Thread B** reads the ref count: `2`.
4. **Thread B** deletes a ref. New count: `1`.
5. _Context Switch back to A_.
6. **Thread A** subtracts 1 ref from the value it remembers (`2`). New count: `1`.

**The Fatal Result**: The count is **1**, but it should be **0**. The object stays in memory forever (a Memory Leak).

**The Even Worse Result**: If the timing is slightly different, both threads might see the count reach 0 simultaneously and try to delete it from memory twice. This causes a "Double Free" error, which crashes the entire Python process (Segmentation Fault).

## The "Why Not Just Fix It?" Years

For the last 20 years, whenever someone suggested removing the GIL, the core developers would sigh and say, "We tried that. It was awful."

In the 90s, they tried "fine-grained locking." Instead of one giant lock on the whole building, they put tiny padlocks on every single object.

The problem? Python touches those reference counts constantly. Locking and unlocking millions of tiny padlocks every second takes CPU time. The result was that standard, single-threaded Python code got about two times slower. Nobody wanted that trade-off.

So, we stuck with the GIL. It was fast for single threads, safe for memory, and we all just learned to use `multiprocessing` if we really needed to use all our cores.

## The Plot Twist: PEP 703 and the No-GIL Future

Then, a few years ago, Sam Gross (a Meta's developer with apparently too much free time) showed up with [a fork of Python that removed the GIL](https://github.com/colesbury/nogil/) without wrecking single-threaded performance.

The community collectively gasped. The core developers raised an eyebrow. And after much review, PEP 703 was accepted.

Starting experimentally in Python 3.13 (released late 2024), you can download a "free-threaded" build of Python. The GIL is gone.

How did they do it? They didn't just remove the lock. They performed open-heart surgery on Python’s memory management system. They replaced the GIL not with one thing, but with three very clever things working together.

#### 1. [The "Owner" System (Biased Reference Counting)](https://peps.python.org/pep-0703/#biased-reference-counting)

This is the genius part. They realized that in most programs, an object is created by one thread and usually only ever touched by that thread.

So now, objects "remember" who created them. If the **Owner Thread** wants to update the reference count, it uses the fast, old-school method. No locks needed. If a **Visiting Thread** wants to touch someone else’s object, it has to take the "slow path," using safer, heavier atomic CPU instructions to ensure it doesn't break anything.

Since the "slow path" happens rarely, most code stays fast.

> PR: https://github.com/python/cpython/issues/110481

#### 2. [Immortal Objects](https://peps.python.org/pep-0703/#immortalization)

Why were we wasting CPU cycles constantly updating the reference counts for `None`, `True`, `False` and `small integers`? They are never going to die.

In the new system, these are marked **Immortal**. Their reference count is set to a special value that tells the interpreter: _"Never touch this count. Never delete this."_.

Two threads can use `None` simultaneously without fighting over the memory address.

#### 3. [Everyone Gets Their Own Desk: Mimalloc (Thread-Safe Allocator)](https://peps.python.org/pep-0703/#memory-management)

Python’s old memory allocator (`pymalloc`) was designed for a single-threaded world. The pymalloc implementation is not thread-safe without the GIL.

The new Python swaps this out for Mimalloc (a high-performance allocator from Microsoft).

Think of it this way: Instead of one central office supply closet that everyone has to line up for, Mimalloc gives every thread its own personal desk drawer full of RAM to use freely.

## How does it impact to us? We adapt

We are in a transition period.

But if you are doing CPU-heavy work—data science, image processing, complex math—the shackles are off. Your multithreaded Python code will finally be able to light up every core on your machine across shared memory.

The GIL has been a faithful, if annoying, servant for decades. But the future is parallel, and Python is finally ready to join the party.

## References:

- https://peps.python.org/pep-0703/#reference-counting
- https://towardsdatascience.com/dont-know-what-is-python-gil-this-may-be-the-easiest-tutorial-3b99805d2225/
