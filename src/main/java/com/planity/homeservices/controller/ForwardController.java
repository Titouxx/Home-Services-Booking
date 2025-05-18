package com.planity.homeservices.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ForwardController {

    @RequestMapping(value = "/{path:^(?!api).*$}")
    public String redirect() {
        return "forward:/index.html";
    }
}

