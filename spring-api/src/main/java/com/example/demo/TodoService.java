package com.example.demo;

import org.springframework.web.bind.annotation.RestController;

@RestController
public class TodoService {

    public static int getResult(String param) {
        int result = Integer.parseInt(param) *1000;
        return result;
    }
}