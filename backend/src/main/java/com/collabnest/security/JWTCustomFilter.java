package com.collabnest.security;

import java.io.IOException;

import org.hibernate.annotations.Comment;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

//create custom filter by extending from OncePerRequestFilter
//It will be executed once / every request
@Component //to declare it as a spring bean
@AllArgsConstructor
public class JWTCustomFilter extends OncePerRequestFilter{
	//verify JWT
	//depcy - JwtUtils
	private final JwtUtils jwtUtils;

	@Override
	protected void doFilterInternal(HttpServletRequest request, 
			HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		// DEBUG: Print Authorization header
		String headerValue = request.getHeader("Authorization");
		System.out.println("Authorization header: " + headerValue);
		// Log servlet path for debugging
		System.out.println("JWTCustomFilter path: " + request.getServletPath());
		// Skip JWT validation for public endpoints
		String path = request.getServletPath();
		if (path.equals("/api/auth/login") || path.equals("/api/auth/register/student") || path.equals("/api/auth/register/alumni") || path.equals("/api/auth/register/faculty")) {
			filterChain.doFilter(request, response);
			return;
		}
		//1. Check for authorization req header

		//2. checking for not null n extract JWT
		if(headerValue != null && headerValue.startsWith("Bearer ")) {
			//3. => jwt - present , extract JWT
			String jwt=headerValue.substring(7);
			//4. verify the token using JWT utils class
			Authentication authentication = jwtUtils.populateAuthenticationTokenFromJWT(jwt);
			System.out.println("auth obj in filter: " + authentication);
			if (authentication != null) {
				System.out.println("Authorities: " + authentication.getAuthorities());
			}
			//5. store this authentication object in spring sec ctx holder
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}
		//to continue with remaining filter chain sequence
		filterChain.doFilter(request, response);
		
	}

}
