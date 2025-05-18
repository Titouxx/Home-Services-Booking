package com.planity.homeservices.basket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/basket")
@CrossOrigin(origins = "*") // À adapter si tu veux limiter l’accès
public class BasketController {

    @Autowired
    private BasketItemRepository repository;

    @GetMapping
    public List<BasketItem> getAll() {
        return repository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PostMapping
    public BasketItem addItem(@RequestBody BasketItem item) {
        return repository.save(item);
    }
}
