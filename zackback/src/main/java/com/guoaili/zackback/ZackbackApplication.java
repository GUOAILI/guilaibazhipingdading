package com.guoaili.zackback;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;

@SpringBootApplication
@EnableAspectJAutoProxy
@EnableEncryptableProperties
public class ZackbackApplication {
	public static void main(String[] args) {
		SpringApplication.run(ZackbackApplication.class, args);
	}
}