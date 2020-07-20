"use strict";

(function (_document) {
	function addCard(selector, image, title, description) {
		$(selector).append(
			"<div class = 'card'>" +
				"<img src = 'image/" + image + "' class = 'card-img-top' alt = '...'>" +
				"<div class = 'card-body'>" +
					"<h5 class = 'card-title'>" + title + "</h5>" +
					"<p class = 'card-text'>" + description + "</p>" +
				"</div>" +
			"</div>");
	};

	emailjs.init("user_vP6GnRzJr7w8EKGUQvS5I");

	$(function () {
		document.getElementById("contact-form")
			.addEventListener("submit", function (event) {
				event.preventDefault();
				this.id.value = 1E+9 * Math.random() | 0;
				console.log("Sending form...");
				console.log(this);
				emailjs.sendForm("Z6Dl67fFuCSKMjACs1jTfKnenHovoy5g", "W2ocWyuUVb32I2W8r6uwj8G6gzEG9xPZ", this)
					.then(function (response) {
						console.log("Mensaje enviado.", response.status, response.text);
					}, function (error) {
						console.log("Fallo al enviar mensaje.", error);
					});
			});
		$.getJSON("../data/furniture.json", function (data) {
			console.log(data);
		});
		addCard("#furniture", "furniture/img1.jpg", "Armario", "Un armario de 4 puertas corredizas y flotantes.");
	});
})(document);
