"use strict";

(function (_document) {
	function addCard(selector, image, title, description) {
		$(selector).append(
			"<div class = 'card'>" +
				"<img src = 'image/" + image + "' class = 'card-img-top' alt = '" + title + "' loading = 'lazy'>" +
				"<div class = 'card-body'>" +
					"<h5 class = 'card-title'>" + title + "</h5>" +
					"<p class = 'card-text'>" + description + "</p>" +
				"</div>" +
			"</div>");
	};

	function addFurnitureCard(furniture) {
		addCard("#furnitures", "furniture/" + furniture.thumbnail, furniture.title, furniture.description);
	}

	function addSouvenirCard(souvenir) {
		addCard("#souvenirs", "souvenir/" + souvenir.thumbnail, souvenir.title, souvenir.description);
	}

	function addMiscellaneousCard(miscellaneous) {
		addCard("#miscellaneous", "miscellaneous/" + miscellaneous.thumbnail, miscellaneous.title, miscellaneous.description);
	}

	function displayCount(selector, count) {
		$(selector).text("Total: " + count);
	}

	function countFurnitures(count) {
		displayCount("#total-furnitures", count);
	}

	function countSouvenirs(count) {
		displayCount("#total-souvenirs", count);
	}

	function countMiscellaneous(count) {
		displayCount("#total-miscellaneous", count);
	}

	function loadData(source, adder, counter) {
		$.getJSON("../data/" + source, function (data) {
			counter(data.length);
			for (var i = 0; i < data.length; ++i) {
				adder(data[i]);
			}
		});
	}

	emailjs.init("user_vP6GnRzJr7w8EKGUQvS5I");

	toastr.options = {
		"closeButton" : false,
		"debug" : false,
		"newestOnTop" : true,
		"progressBar" : true,
		"positionClass" : "toast-top-right",
		"preventDuplicates" : false,
		"onclick" : null,
		"showDuration" : "300",
		"hideDuration" : "1000",
		"timeOut" : "5000",
		"extendedTimeOut" : "1000",
		"showEasing" : "swing",
		"hideEasing" : "linear",
		"showMethod" : "fadeIn",
		"hideMethod" : "fadeOut"
	};

	$(function () {
		const contactForm = $("#contact-form");
		const sendButton = $("#send-button");
		contactForm.parsley({
			"data-parsley-focus" : "first",
			"data-parsley-ui-enabled" : true,
			"errorTemplate" : "<small></small>",
			"errorsWrapper" : "<span class = 'form-error'></span>"
		});
		$("#contact-form .form-control").on("input propertychange paste", () => {
			if (contactForm.parsley().isValid() == true) {
				sendButton.removeAttr("disabled");
			}
			else {
				sendButton.attr("disabled", "disabled");
			}
		});
		$(".sliding-link").click(function (event) {
			event.preventDefault();
			const aid = $(this).attr("href");
			$("html, body").animate({
				scrollTop : $(aid).offset().top
			}, "slow");
		});
		document.getElementById("contact-form")
			.addEventListener("submit", function (event) {
				const thisForm = this;
				sendButton.html("<div class = 'spinner-border spinner-border-sm' role = 'status'/>");
				sendButton.attr("disabled", "disabled");
				event.preventDefault();
				thisForm.id.value = 1E+9 * Math.random() | 0;
				emailjs.sendForm("Z6Dl67fFuCSKMjACs1jTfKnenHovoy5g", "W2ocWyuUVb32I2W8r6uwj8G6gzEG9xPZ", this)
					.then(function (response) {
						thisForm.reset();
						sendButton.html("Enviar");
						toastr["success"]("Nos contactaremos con usted al número telefónico indicado, lo antes posible.",
							"Consulta enviada!");
					}, function (error) {
						sendButton.removeAttr("disabled");
						sendButton.html("Enviar");
						toastr["error"]("Hubo un problema al enviar su consulta... ¡pero es nuestro!. Inténtelo nuevamente o dentro de unos minutos. ¿Tiene conexión a internet?",
							"Error al enviar consulta");
					});
			});
		loadData("furniture.json", addFurnitureCard, countFurnitures);
		loadData("souvenir.json", addSouvenirCard, countSouvenirs);
		loadData("miscellaneous.json", addMiscellaneousCard, countMiscellaneous);
	});
})(document);
