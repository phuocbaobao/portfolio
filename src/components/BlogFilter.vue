<template>
  <div class="blog-filter">
    <div class="filter-header">
      <h3>Filter by tag:</h3>
      <button 
        v-if="selectedTags.length > 0" 
        @click="clearFilters"
        class="clear-btn"
      >
        Clear filters
      </button>
    </div>
    
    <div class="tags-container">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="toggleTag(tag)"
        :class="['tag-btn', { active: selectedTags.includes(tag) }]"
      >
        {{ tag }}
      </button>
    </div>
    
    <div class="blog-posts">
      <a 
        v-for="post in filteredPosts"
        :key="post.id"
        :href="`/blog/${post.slug}`"
        class="blog-post-card"
      >
        <div class="post-date">{{ formatDate(post.date) }}</div>
        <h3>{{ post.title }}</h3>
        <p class="post-description">{{ post.description }}</p>
        <div class="post-meta">
          <span class="read-time">{{ post.readTime }}</span>
        </div>
        <div class="post-tags">
          <span 
            v-for="tag in post.tags"
            :key="tag"
            class="post-tag"
          >
            {{ tag }}
          </span>
        </div>
      </a>
      
      <div v-if="filteredPosts.length === 0" class="no-results">
        <p>No posts found with the selected tags.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
  author: string;
  readTime: string;
}

interface Props {
  posts: BlogPost[];
}

const props = defineProps<Props>();

const selectedTags = ref<string[]>([]);

// Get all unique tags
const allTags = computed(() => {
  const tags = new Set<string>();
  props.posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
});

// Filter posts based on selected tags
const filteredPosts = computed(() => {
  if (selectedTags.value.length === 0) {
    return props.posts;
  }
  
  return props.posts.filter(post => {
    return selectedTags.value.some(tag => post.tags.includes(tag));
  });
});

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
};

const clearFilters = () => {
  selectedTags.value = [];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.blog-filter {
  width: 100%;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.filter-header h3 {
  font-size: var(--text-xl);
  color: var(--color-text);
  margin: 0;
}

.clear-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.tag-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
}

.tag-btn:hover {
  background: var(--color-bg);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
}

.tag-btn.active {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-md);
}

.blog-posts {
  display: grid;
  gap: var(--spacing-xl);
}

.blog-post-card {
  display: block;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  transition: all var(--transition-base);
  animation: slideInUp 0.5s ease-out;
  text-decoration: none;
  color: inherit;
}

.blog-post-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-xl);
}

.post-date {
  color: var(--color-primary);
  font-size: var(--text-sm);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.blog-post-card h3 {
  font-size: var(--text-2xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
  transition: color var(--transition-fast);
}

.blog-post-card:hover h3 {
  color: var(--color-primary);
}

.post-description {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.post-meta {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  margin-bottom: var(--spacing-sm);
}

.read-time::before {
  content: '📖 ';
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.post-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-tertiary);
  color: var(--color-text-muted);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
}

.no-results {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-muted);
}

.no-results p {
  font-size: var(--text-lg);
}

@media (max-width: 768px) {
  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}
</style>
