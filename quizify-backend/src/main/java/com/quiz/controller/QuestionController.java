package com.quiz.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.quiz.model.Question;
import com.quiz.service.IQuestionService;

import jakarta.validation.Valid;

@CrossOrigin(origins =  "*")
@RestController
@RequestMapping("/api/quizes")
public class QuestionController {

	@Autowired
	private IQuestionService questionService;

	// create new question
	@PostMapping("/create-new-question")
	public ResponseEntity<Question> createQuestion(@Valid @RequestBody Question question) {
		Question createdQuestion = questionService.createQuestion(question);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdQuestion);
	}

	// get all the questions
	@GetMapping("/all-questions")
	public ResponseEntity<List<Question>> getAllQuestions() {
		List<Question> questions = questionService.getAllQuestions();
		return ResponseEntity.ok(questions);
	}

	// get single question
	@GetMapping("/question/{id}")
	public ResponseEntity<Question> getQuestionById(@PathVariable Long id) throws ChangeSetPersister.NotFoundException {
		Optional<Question> theQuestion = questionService.getQuestionById(id);
		if (theQuestion.isPresent()) {
			return ResponseEntity.ok(theQuestion.get());
		} else {
			throw new ChangeSetPersister.NotFoundException();
		}
	}

	// update the question
	@PutMapping("/question/{id}/update")
	public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question question)
			throws NotFoundException {
		Question updatedQuestion = questionService.updateQuestion(id, question);
		return ResponseEntity.ok(updatedQuestion);
	}

	// delete the question
	@DeleteMapping("/question/{id}/delete")
	public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
		questionService.deleteQuestion(id);
		return ResponseEntity.noContent().build();
	}

	// get all the subject
	@GetMapping("/subjects")
	public ResponseEntity<List<String>> getAllSubjects() {
		List<String> subjects = questionService.getAllSubjects();
		return ResponseEntity.ok(subjects);
	}

	// get the number of questions entered by the user
	@GetMapping("/quiz/fetch-questions-for-user")
	public ResponseEntity<List<Question>> getQuestionsForUser(@RequestParam Integer numOfQuestions, @RequestParam String subject){
		List<Question> allQuestions = questionService.getQuestionForUser(numOfQuestions, subject);
		List<Question> mutableQuestions = new ArrayList<>(allQuestions);
		Collections.shuffle(mutableQuestions);
		
		int availableQuestions = Math.min(numOfQuestions, mutableQuestions.size());
		List<Question> randomQuestions = mutableQuestions.subList(0, availableQuestions);
		return ResponseEntity.ok(randomQuestions);
	}
}
