package com.hotelbooker.payment.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class StripeConfig {
    
    @Value("${stripe.api-key}")
    private String apiKey;
    
    @Value("${stripe.publishable-key}")
    private String publishableKey;
    
    @Value("${stripe.webhook-secret:}")
    private String webhookSecret;
    
    @PostConstruct
    public void init() {
        Stripe.apiKey = apiKey;
    }
}
