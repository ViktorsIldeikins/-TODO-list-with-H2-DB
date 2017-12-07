$("#newTaskForm").submit((e) => {
	e.preventDefault();     //To prevent reloading page when submitting
});

//checks if same task exists for the same person
function duplicateTask(person, task) {
	const allTasks = document.getElementById("listOfTasks").getElementsByClassName("taskRow");
	for (let i = 0; i < allTasks.length; i++) {
		if ((allTasks[i].getElementsByTagName("td")[1].innerHTML === task) && (allTasks[i].getElementsByTagName("td")[0].innerHTML === person)) {
			return true;
		}
	}
	return false;
}

function validateInputForm() {
	let personErrField = $("#personErrorField").empty();
	let taskErrField = $("#taskErrorField").empty();
	let coffeeErrField = $("#coffeeErrorField").empty();
	let generalErrField = $("#generalErrorField").empty();
	const personField = $("#personField");
	const taskField = $("#taskField");
	const coffeeField = $("#coffeeField");
	let result = true;
	if (personField.val() === "") {
		personErrField.text("Enter responsible person");
		result = false;
	}
	if (taskField.val() === "") {
		taskErrField.text("Enter task");
		result = false;
	}
	if (result && duplicateTask(personField.val(), taskField.val())) {
		generalErrField.text("This task for this person already exists");
		result = false;
	}
	if (isNaN(coffeeField.val())) {
		coffeeErrField.text("Please enter number");
		result = false;
	}
	return result;
}

function addTask() {
	if (validateInputForm()) {
		$(document).ready(() => {
			$.ajax({
				type: "POST",
				url: "/todolist/addTask",
				data: $("#newTaskForm").serialize()
			}).done((result) => {
				if (result === "success") {
					let table = $("#listOfTasks")[0];
					let row = table.insertRow(table.rows.length);
					const personField = $("#personField");
					const taskField = $("#taskField");
					let coffeeField = $("#coffeeField");
					if ((coffeeField.val() === "") || (coffeeField.val() === "0")) {
						coffeeField.val("no estimate");
					}
					row.setAttribute("class", "taskRow");
					row.insertCell(0).innerHTML = personField.val();
					row.insertCell(1).innerHTML = taskField.val();
					row.insertCell(2).innerHTML = coffeeField.val();
                    row.insertCell(3).innerHTML = "<progress value=0 max=" + coffeeField.val() + "></progress>";
                    row.insertCell(4).innerHTML = "<input type=\"button\" value=\"log consumed coffee cup\" " +
                        "onclick=\"logCoffeeCup(this.parentElement.parentElement)\"> \n" +
                        "<input type=\"button\" value=\"Remove task\" " +
                        "onclick=\"removeTask(this,'"+personField.val()+"','"+taskField.val()+"')\">";
				}
			}).fail(() => $("#target").text("...ups....something went wrong")
			).always(() => {
				$("#personField").val("");
				$("#taskField").val("");
				$("#coffeeField").val("");
			})
		})
	}
}

function logCoffeeCup(row) {
    let usedCoffeeCups = row.getElementsByTagName("progress")[0].getAttribute("value");
    usedCoffeeCups++;
    $(document).ready(() => {
        $.ajax({
            type: "POST",
            url: "/todolist/taskUpdated",
            data: {
                person: row.getElementsByTagName("td")[0].innerText,
                task: row.getElementsByTagName("td")[1].innerText,
                usedCoffeeCups: usedCoffeeCups
            }
        }).done((result) => {
            if (result === "success") {
                row.getElementsByTagName("progress")[0].setAttribute("value", usedCoffeeCups);
            }
        })
    })
}

function removeTask(row, personPassed, taskPassed) {
	$(document).ready(function () {
		$.ajax({
			type: "POST",
			url: "/todolist/removeTask",
			data: {
				person: personPassed,
				task: taskPassed
			},
			success: function (result) {
				console.log("DELETE method success");
				if (result === "success") {
					deleteRow(row, "listOfTasks");
				} else {
					$("#target").html("error");
				}
			}
		});
	})
}

function deleteRow(row, table) {
	let i = row.parentNode.parentNode.rowIndex;
	document.getElementById(table).deleteRow(i);
}
