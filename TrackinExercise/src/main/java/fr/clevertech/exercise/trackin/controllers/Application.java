package fr.clevertech.exercise.trackin.controllers;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
@Scope("singleton")
public class Application {

	 private static final Logger logger = LoggerFactory.getLogger(Application.class);

	 private static SessionFactory sessionFactory;
	 private static Session session;

	@PostConstruct
	public void setUp() {
		
		logger.info("Initialize Hibernate and setup database connection");
		
		// configures settings from hibernate.cfg.xml
		final StandardServiceRegistry registry = new StandardServiceRegistryBuilder().configure().build();
		try {
			sessionFactory = new MetadataSources(registry).buildMetadata().buildSessionFactory();
		} catch (Exception e) {

			// log exception
			logger.error(e.getMessage(), e);

			// The registry would be destroyed by the SessionFactory, but we had
			// trouble building the SessionFactory
			// so destroy it manually.
			StandardServiceRegistryBuilder.destroy(registry);
		}
				
	}
	
	@PreDestroy
	public void clean() {
		
		// End session
		if(sessionFactory.isOpen()) {
			logger.info("Close database connection");
			sessionFactory.close();
		}
				
	}
	
	/**
	 * Return Hibernate Session Factory initialized
	 * @return
	 */
	public static SessionFactory getSessionFactory() {
		return sessionFactory;
	}
	
	/**
	 * Return Hibernate session singleton
	 * @return
	 */
	public static Session getActiveSession() {
		if(session == null || !session.isConnected()) {
			session = sessionFactory.openSession();
		}
		return session;
	}
	
	@RequestMapping("/")
	public String index() {
		return "index.jsp";
	}

}
