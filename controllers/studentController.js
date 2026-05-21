import Student from "../models/student.js";
import { isAdmin } from "./userController.js";

// export function getAllStudents(req, res){

// 	Student.find().then(

// 		(students) => {
// 			console.log(students);
// 			res.json(students);
// 		}

// 	);

// };

export async function getAllStudents(req, res) {

	console.log(req.user)

	try {

		const students = await Student.find();
		res.json(students);

	} catch (error) {
		console.error("Error fetching students:", error);
		return res.json({ message: "Internal server error" });
	}

}

export function createStudent(req, res) {

	if (isAdmin(req)) {

		const student = new Student(req.body);

		student.save().then(
			() => {
				res.json({ message: "Student saved successfully" });
			}
		)

	} else {
		res.json({ message: "You need to login as an admin" })
	}

};