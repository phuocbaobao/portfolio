<template>
  <div class="contact-form-wrapper">
    <form @submit.prevent="handleSubmit" class="contact-form">
      <div class="form-group">
        <label for="name">Your Name *</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          placeholder="Enter your name"
          :class="{ error: errors.name }"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>
      
      <div class="form-group">
        <label for="email">Email *</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          required
          placeholder="your.email@example.com"
          :class="{ error: errors.email }"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>
      
      <div class="form-group">
        <label for="subject">Subject</label>
        <input
          id="subject"
          v-model="formData.subject"
          type="text"
          placeholder="Message subject"
        />
      </div>
      
      <div class="form-group">
        <label for="message">Message *</label>
        <textarea
          id="message"
          v-model="formData.message"
          required
          rows="6"
          placeholder="Enter your message..."
          :class="{ error: errors.message }"
        ></textarea>
        <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
      </div>
      
      <button 
        type="submit" 
        class="btn btn-primary submit-btn"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Sending...' : 'Send Message' }}
      </button>
    </form>
    
    <!-- Success Message -->
    <transition name="fade">
      <div v-if="showSuccess" class="success-message">
        <div class="success-icon">✓</div>
        <h3>Sent successfully!</h3>
        <p>Thank you for contacting me. I will respond as soon as possible.</p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

const formData = reactive<FormData>({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const errors = reactive<Errors>({});
const isSubmitting = ref(false);
const showSuccess = ref(false);

const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key as keyof Errors]);
  
  let isValid = true;
  
  if (!formData.name.trim()) {
    errors.name = 'Please enter your name';
    isValid = false;
  }
  
  if (!formData.email.trim()) {
    errors.email = 'Please enter your email';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Invalid email address';
    isValid = false;
  }
  
  if (!formData.message.trim()) {
    errors.message = 'Please enter a message';
    isValid = false;
  }
  
  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Send email directly from frontend using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact Form <onboarding@resend.dev>',
        to: ['phuocbaohuynh@gmail.com'],
        subject: formData.subject || `New message from ${formData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">New Contact Form Submission</h2>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${formData.name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${formData.email}</p>
              ${formData.subject ? `<p style="margin: 10px 0;"><strong>Subject:</strong> ${formData.subject}</p>` : ''}
            </div>
            <div style="margin: 20px 0;">
              <h3 style="color: #374151;">Message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${formData.message}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              This email was sent from your portfolio contact form.
            </p>
          </div>
        `,
        reply_to: formData.email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      throw new Error('Failed to send email. Please try again later.');
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    
    // Success!
    showSuccess.value = true;
    
    // Reset form
    formData.name = '';
    formData.email = '';
    formData.subject = '';
    formData.message = '';
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false;
    }, 5000);
    
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Failed to send message. Please try again or contact me directly at phuocbaohuynh@gmail.com');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.contact-form-wrapper {
  position: relative;
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

label {
  display: block;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
  font-size: var(--text-base);
}

input,
textarea {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--text-base);
  font-family: var(--font-sans);
  transition: all var(--transition-base);
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

input.error,
textarea.error {
  border-color: #ef4444;
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: var(--text-sm);
  margin-top: var(--spacing-xs);
}

textarea {
  resize: vertical;
  min-height: 150px;
}

.submit-btn {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--text-lg);
  margin-top: var(--spacing-md);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.success-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  text-align: center;
  box-shadow: var(--shadow-xl);
  z-index: 10;
  min-width: 300px;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  margin: 0 auto var(--spacing-md);
  animation: scaleIn 0.5s ease-out;
}

.success-message h3 {
  font-size: var(--text-2xl);
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

.success-message p {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
