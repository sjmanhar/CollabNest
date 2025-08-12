package com.collabnest.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.AllArgsConstructor;

@Configuration // to declare the as java config class
// equivalent to bean config xml file
@EnableWebSecurity // to enable spring sec config in this class
@EnableMethodSecurity // to enable method level security
@AllArgsConstructor
public class SecurityConfiguration {
	// depcy
	private final PasswordEncoder encoder;
	private final JWTCustomFilter jwtCustomFilter;

	/*
	 * Configure spring bean (@Bean) to configure spring securtiy filter chain
	 * 
	 */
	@Bean
	SecurityFilterChain configureSecFilterChain(HttpSecurity http) throws Exception {
		// disable CSRF protection : since un necessary with stateless REST APIs
		http.csrf(csrf -> csrf.disable());
		// form login is enabled by default , to disable it
		http.formLogin(form -> form.disable());
				// enable Basic HTTP auth
			//	.httpBasic(Customizer.withDefaults());
		// add URL based authorization rules
		// un protected end points - swagger , view products
		http.authorizeHttpRequests(request -> request
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
				// Swagger and static resources
				.requestMatchers("/v*/api-docs/**", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/actuator/**", "/", "/webjars/**", "/favicon.ico").permitAll()
				// Registration & login (public)
				.requestMatchers("/api/auth/register/student", "/api/auth/register/alumni", "/api/auth/login").permitAll()
				// Faculty registration (admin only)
				.requestMatchers("/api/auth/register/faculty").hasRole("ADMIN")
				// Admin endpoints
				.requestMatchers("/api/admin/**").hasRole("ADMIN")
				// Faculty endpoints
				.requestMatchers("/api/events/faculty/**", "/api/jobs/faculty/**", "/api/faculty/**").hasRole("FACULTY")
				// Alumni endpoints
				.requestMatchers("/api/alumni/update/**", "/api/alumni/by-user/**").hasRole("ALUMNI")
                // Referral endpoints
                .requestMatchers("/api/referrals/alumni/**", "/api/referrals/*/alumni/**").hasRole("ALUMNI")
                .requestMatchers("/api/referrals/active", "/api/referrals/student/**", "/api/referrals/*/apply/**").hasRole("STUDENT")
                // Referral Application endpoints
                .requestMatchers("/api/referral-applications/apply/**", "/api/referral-applications/student/**").hasRole("STUDENT")
                .requestMatchers("/api/referral-applications/referral/**", "/api/referral-applications/approve/**").hasRole("ALUMNI")
                .requestMatchers("/api/referrals/**").permitAll()
				// Student endpoints
				.requestMatchers("/api/student/update/**", "/api/student/by-user/**").hasRole("STUDENT")

                // Payment endpoints: allow any authenticated user (student, alumni, faculty, admin)
                .requestMatchers("/api/payments/**").authenticated()

				// Event and job viewing/registration (authenticated)
				.requestMatchers("/api/events/**", "/api/jobs/**").authenticated()
				// Everything else
				.anyRequest().authenticated())
				// tell Spring sec - not to create any HttpSession object
				// to store spring security info
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		//add custom jwt filter before 1st auth filter 
		http.addFilterBefore(jwtCustomFilter, 
				UsernamePasswordAuthenticationFilter.class);
		// HttpSecurity class builds spring sec filter chain , as per above
		// customizations
		return http.build();
	}

	// configure spring bean - auth mgr
	@Bean
	AuthenticationManager authenticationManager
	(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

}
