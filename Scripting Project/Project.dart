import 'dart:io';

void main() {
  List<String> tasks = [];
  bool isRunning = true;

  print('--- Welcome to My To-Do List ---');

  while (isRunning) {
    print('\nTo-Do List Menu:');
    print('1. Add Task');
    print('2. View Tasks');
    print('3. Remove Task');
    print('4. Exit');
    
    stdout.write('Enter your choice (1-4): ');
    String? choice = stdin.readLineSync();

    if (choice == '1') {
      stdout.write('Enter the task description: ');
      String? newTask = stdin.readLineSync();
      if (newTask != null && newTask.isNotEmpty) {
        tasks.add(newTask);
        print('Task added successfully!');
      }

    } else if (choice == '2') {
      print('\n--- Your Current Tasks ---');
      if (tasks.isEmpty) {
        print('Your list is empty.');
      } else {
        for (int i = 0; i < tasks.length; i++) {
          print('${i + 1}. ${tasks[i]}');
        }
      }

    } else if (choice == '3') {
      if (tasks.isEmpty) {
        print('Nothing to remove.');
      } else {
        stdout.write('Enter the task number to remove: ');
        String? input = stdin.readLineSync();
        int? index = int.tryParse(input ?? '');

        if (index != null && index > 0 && index <= tasks.length) {
          tasks.removeAt(index - 1);
          print('Task removed successfully.');
        } else {
          print('Invalid task number.');
        }
      }

    } else if (choice == '4') {
      print('Exiting... Goodbye!');
      isRunning = false;

    } else {
      print('Invalid choice, please try again.');
    }
  }
}