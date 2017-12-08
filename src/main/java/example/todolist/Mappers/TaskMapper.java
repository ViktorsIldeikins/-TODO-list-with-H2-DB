package example.todolist.Mappers;


import example.todolist.Task;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;


@Mapper
@Component
public interface TaskMapper {

	@Select("select * from tasks")
	List<Task> getAll();

	@Insert("insert into tasks(person,task,priority,amountOfCoffeeCups) values(#{person},#{task},#{priority},#{amountOfCoffeeCups})")
	@SelectKey(statement = "Select Last_Insert_id()", keyProperty ="id", before = false, resultType = Integer.class)
	void insert(Task task);

	@Update("update tasks set usedCoffeeCups=#{usedCoffeeCups} where (person=#{person})and(task=#{task})")
	void update(Task task);

	@Delete("Delete from tasks where (person=#{person})and(task=#{task})")
	void remove(Task task);

	@Insert("CREATE TABLE IF Not EXISTS Tasks\n" +
			"(\n" +
			"    id int(10) NOT NULL AUTO_INCREMENT,\n" +
			"    person varchar(100) NOT NULL,\n" +
			"    task VARCHAR (100) NOT NULL,\n" +
			"    priority VARCHAR (100) NOT NULL,\n" +
			"    amountOfCoffeeCups int(10) DEFAULT 0,\n" +
			"    usedCoffeeCups int(10) DEFAULT 0,\n" +
			"    PRIMARY KEY (id)\n" +
			");")
	void createTable();

}
