package com.example.demo;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/todo")
    public String hello(@RequestParam String param) {
        int result = TodoService.getResult(param);
//        var result2= getResult(param);
        return "hello"+ result;
    }
    
    @PostMapping
    public String addTodo(@RequestParam String param) {
        int result = TodoService.getResult(param);
        return "add todo" + result;
    }
    @DeleteMapping
    public String deleteTodo(@RequestParam String param) {
        int result = TodoService.getResult(param);
        return "delete todo" + result;
    }
}