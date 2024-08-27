const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.logNewTodo = functions.firestore
    .document("todos/{todoId}")
    .onCreate((snap, context) => {
      const newValue = snap.data();
      console.log("New To-Do Created:", newValue);
      return null;
    });
