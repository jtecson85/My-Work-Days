// Initialize tasks array
var tasks = [];

// Load tasks from localStorage
var loadTasks = function() {
    var storedTasks = JSON.parse(localStorage.getItem("tasks"));

    // If tasks are not empty, populate the array, else start with an empty task
    tasks = storedTasks ? storedTasks : [{ time: "", task: "" }];

    tasks.forEach(function(task) {
        addTask(task.time, task.task);
    });
}

// Add task to the UI
var addTask = function(taskTime, taskText) {
    var taskItem = $("<p>").addClass("m-2 task-item").text(taskText);
    $("#hr-" + taskTime).find(".time-block").append(taskItem);
}

// Save tasks to localStorage
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Edit task on click
$(".time-slot").on("click", ".time-block", function() {
    var text = $(this).text().trim();
    var textInput = $("<textarea>").addClass("col-10 form-control").val(text);
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
});

// Save button action
$(".save-btn").on("click", function() {
    var textArea = $(this).closest(".time-slot").find(".form-control");
    var text = textArea.val().trim();

    var taskP = $("<div>")
        .addClass("col-10 time-block")
        .html("<p class='m-2 task-item'>" + text + "</p>");

    textArea.replaceWith(taskP);

    var taskTime = $(this).closest(".time-slot").attr("id").replace("hr-", "");
    var index = $(this).closest(".time-slot").index();

    tasks[index] = { time: taskTime, task: text };

    saveTasks();
    auditTime();
});

// Adjust UI based on the current time
var auditTime = function() {
    var currentHr = moment().hour();

    for (i = 9; i < 18; i++) {
        var timeSlotEl = $("#hr-" + i).find(".time-block");
        timeSlotEl.removeClass("past present future");

        if (currentHr < i) {
            timeSlotEl.addClass("future");
        } else if (currentHr > i) {
            timeSlotEl.addClass("past");
        } else {
            timeSlotEl.addClass("present");
        }
    }
}

// Clear scheduler
$(".reset-btn").on("click", function() {
    localStorage.clear();
    $(".task-item").remove(); 
});

// Display current time and update time-block
$("#currentDay").text("It is currently " + moment().format("h:mm A on dddd, MMMM D" + "."));
setInterval(function() {
    $("#currentDay").text("It is currently " + moment().format("h:mm A on dddd, MMMM D" + "."));
    auditTime();
}, 60000);

// Initialize the app
loadTasks();
auditTime();
