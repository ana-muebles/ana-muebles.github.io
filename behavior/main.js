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

	function addFurnitureCard(furniture) {
		addCard("#furnitures", "furniture/" + furniture.thumbnail, furniture.title, furniture.description);
	}

	function addSourvenirCard(souvenir) {
		addCard("#souvenirs", "souvenir/" + souvenir.thumbnail, souvenir.title, souvenir.description);
	}

	function addMiscellaneousCard(miscellaneous) {
		addCard("#miscellaneous", "miscellaneous/" + miscellaneous.thumbnail, miscellaneous.title, miscellaneous.description);
	}

	function loadData(source, adder) {
		$.getJSON("../data/" + source, function (data) {
			for (var i = 0; i < data.length; ++i) {
				adder(data[i]);
			}
		});
	}

	emailjs.init("user_vP6GnRzJr7w8EKGUQvS5I");

	$(function () {
		$(".sliding-link").click(function (event) {
			event.preventDefault();
			const aid = $(this).attr("href");
			$("html,body").animate({
				scrollTop : $(aid).offset().top
			}, "slow");
		});
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
		loadData("furniture.json", addFurnitureCard);
		loadData("souvenir.json", addFurnitureCard);
		loadData("miscellaneous.json", addFurnitureCard);
	});
})(document);
