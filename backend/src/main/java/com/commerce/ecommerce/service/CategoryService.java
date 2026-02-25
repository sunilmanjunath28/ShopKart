package com.commerce.ecommerce.service;

import com.commerce.ecommerce.model.Category;
import com.commerce.ecommerce.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Get all main categories
    public List<Category> getMainCategories() {
        return categoryRepository.findByParentCategoryIdIsNull();
    }

    // Get subcategories
    public List<Category> getSubCategories(Long parentId) {
        return categoryRepository.findByParentCategoryId(parentId);
    }

    // Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get category by ID
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // Get category by name
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    // Create category
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Update category
    public Category updateCategory(Long id, Category categoryDetails) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isPresent()) {
            Category c = category.get();
            if (categoryDetails.getName() != null) c.setName(categoryDetails.getName());
            if (categoryDetails.getDescription() != null) c.setDescription(categoryDetails.getDescription());
            if (categoryDetails.getImageUrl() != null) c.setImageUrl(categoryDetails.getImageUrl());
            if (categoryDetails.getIcon() != null) c.setIcon(categoryDetails.getIcon());
            return categoryRepository.save(c);
        }
        return null;
    }

    // Delete category
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    // Create bulk categories
    public void createBulkCategories(List<Category> categories) {
        categoryRepository.saveAll(categories);
    }
}
