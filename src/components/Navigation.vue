<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-content">
        <!-- Logo -->
        <a href="/" class="logo">
          <span class="logo-text">Portfolio</span>
        </a>
        
        <!-- Desktop Navigation -->
        <ul class="nav-links desktop-nav">
          <li>
            <a 
              href="/" 
              :class="{ active: currentPath === '/' }"
              class="nav-link"
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="/about" 
              :class="{ active: currentPath === '/about' }"
              class="nav-link"
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="/blog" 
              :class="{ active: currentPath === '/blog' }"
              class="nav-link"
            >
              Blog
            </a>
          </li>
          <li>
            <a 
              href="/contact" 
              :class="{ active: currentPath === '/contact' }"
              class="nav-link"
            >
              Contact
            </a>
          </li>
        </ul>
        
        <!-- Mobile Menu Button -->
        <button 
          class="mobile-menu-btn"
          @click="toggleMenu"
          :aria-expanded="isMenuOpen"
          aria-label="Toggle menu"
        >
          <svg 
            v-if="!isMenuOpen" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg 
            v-else 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <!-- Mobile Navigation -->
      <div v-if="isMenuOpen" class="mobile-nav">
        <ul class="mobile-nav-links">
          <li>
            <a 
              href="/" 
              :class="{ active: currentPath === '/' }"
              class="nav-link"
              @click="closeMenu"
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="/about" 
              :class="{ active: currentPath === '/about' }"
              class="nav-link"
              @click="closeMenu"
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="/blog" 
              :class="{ active: currentPath === '/blog' }"
              class="nav-link"
              @click="closeMenu"
            >
              Blog
            </a>
          </li>
          <li>
            <a 
              href="/contact" 
              :class="{ active: currentPath === '/contact' }"
              class="nav-link"
              @click="closeMenu"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  currentPath: string;
}

const props = defineProps<Props>();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md) 0;
  animation: slideInDown 0.5s ease-out;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: var(--text-2xl);
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: transform var(--transition-base);
}

.logo:hover {
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  gap: var(--spacing-lg);
  list-style: none;
  align-items: center;
}

.desktop-nav {
  display: none;
}

.nav-link {
  position: relative;
  color: var(--color-text-secondary);
  font-weight: 500;
  padding: var(--spacing-xs) var(--spacing-sm);
  transition: color var(--transition-fast);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--gradient-primary);
  transition: width var(--transition-base);
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 80%;
}

.nav-link.active {
  color: var(--color-primary);
}

.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: var(--spacing-xs);
  transition: color var(--transition-fast);
}

.mobile-menu-btn:hover {
  color: var(--color-primary);
}

.mobile-nav {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  animation: slideInDown 0.3s ease-out;
}

.mobile-nav-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.mobile-nav-links .nav-link {
  display: block;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.mobile-nav-links .nav-link:hover,
.mobile-nav-links .nav-link.active {
  background: var(--color-bg-tertiary);
}

.mobile-nav-links .nav-link::after {
  display: none;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }
  
  .mobile-menu-btn {
    display: none;
  }
  
  .mobile-nav {
    display: none;
  }
}
</style>
