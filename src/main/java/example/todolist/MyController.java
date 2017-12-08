package example.todolist;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import static org.springframework.web.bind.annotation.RequestMethod.POST;


@Controller
@SessionAttributes("list")
public class MyController {

	private final TaskRepository repository;

	@Autowired
	public MyController(TaskRepository repository) {
		this.repository = repository;
	}

	@RequestMapping("/testData")
	public String init() {
		repository.addTask("Jimmy", "has to delete this test task", "Medium",3);
		repository.addTask("JimmyLongName", "check that table works", "Medium",5);
		return "redirect:/";
	}

	@RequestMapping("/")
	public String testJsp(ModelMap model) {
		model.addAttribute("list", repository);
		repository.getList().forEach(t-> System.out.println(t.toString()));
		return "mainList";
	}

	@RequestMapping(value = "/removeTask", method = POST)
	@ResponseBody
	public String remove(@RequestParam("person") String person, @RequestParam("task") String task) {
		System.out.println("removing-->" + person + " " + task);
		repository.removeTask(person, task);
		return "success";
	}

	@RequestMapping(value = "/taskUpdated", method = POST)
	@ResponseBody
	public String updateTask(@RequestParam("person") String person, @RequestParam("task") String task,
			@RequestParam("usedCoffeeCups") int usedCoffeeCups) {
		repository.updateTask(person, task, usedCoffeeCups);
		return "success";
	}

	@RequestMapping(value = "/addTask", method = POST)
	@ResponseBody
	public String addTask(@RequestParam("person") String person, @RequestParam("task") String task, @RequestParam("priority") String priority,
			@RequestParam(value = "coffee", required = false, defaultValue = "0") int amountOfCoffeeCups) {
		repository.addTask(person, task, priority, amountOfCoffeeCups);
		return "success";
	}


}
