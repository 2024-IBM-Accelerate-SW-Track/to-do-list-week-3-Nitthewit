import { render, screen, fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('test that App component doesn\'t render duplicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /button/i });
  const dueDate = "05/30/2023";

  // Add first task
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  // Try to add duplicate task
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  const tasks = screen.getAllByText(/History Test/i);
  expect(tasks.length).toBe(1);
});

test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /button/i });
  const dueDate = "05/30/2023";

  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  const noTasksMessage = screen.getByText(/You have no todo's left/i);
  expect(noTasksMessage).toBeInTheDocument();
});

test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const addButton = screen.getByRole('button', { name: /button/i });

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.click(addButton);

  const noTasksMessage = screen.getByText(/You have no todo's left/i);
  expect(noTasksMessage).toBeInTheDocument();
});

test('test that App component can delete task through checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /button/i });
  const dueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  const noTasksMessage = screen.getByText(/You have no todo's left/i);
  expect(noTasksMessage).toBeInTheDocument();
});

test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /button/i });
  const pastDueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: pastDueDate } });
  fireEvent.click(addButton);

  const historyCheck = screen.getByTestId(/History Test/i).style.background;
  expect(historyCheck).not.toBe("#ffffffff"); // Assuming white is not the color for overdue items
});
