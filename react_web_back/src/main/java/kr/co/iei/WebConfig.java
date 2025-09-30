package kr.co.iei;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import kr.co.iei.chat.model.service.AllMemberChatHandler;

@Configuration
@EnableWebSocket
public class WebConfig implements WebMvcConfigurer, WebSocketConfigurer{

	@Value("${file.root}")
	private String root;
	
	@Autowired
	private AllMemberChatHandler allMemberChat;
	
	@Bean
	public BCryptPasswordEncoder bcrypt() {
		return new BCryptPasswordEncoder();
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry
			.addResourceHandler("/editor/**")
			.addResourceLocations("file:///"+root+"/editor");
		registry
			.addResourceHandler("/board/thumb/**")
			.addResourceLocations("file:///"+root+"/thumb/");
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		// /allChat이라는 걸로 들어오면 allMemberChat 실행시켜주면 돼
		registry.addHandler(allMemberChat, "/allChat").setAllowedOrigins("*");
	}
	
}
