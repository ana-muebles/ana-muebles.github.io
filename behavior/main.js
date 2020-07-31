"use strict";

(function (_document, _anime, _emailjs, _toastr) {
	/* Estado global de la aplicación. */
	let dataSource = undefined;

	/* Extraer en módulos. */
	function addContent(catalog, content) {
		const hasBody = content.title !== "";
		$("#content-" + catalog.id).append(
			"<div class = 'card'>" +
				"<a href = '#' role = 'button' data-toggle = 'modal' data-target = '#gallery-modal' data-catalog = '" +
					catalog.id + "' data-content = '" + content.id + "'>" +
					"<img src = '" + content.base + content.thumbnail + "' class = 'card-img-top' alt = '' loading = 'lazy'>" +
					(hasBody? ("<div class = 'card-body'>" +
						"<h5 class = 'card-title'>" + content.title + "</h5>" +
						"<p class = 'card-text'>" + content.description + "</p>" +
					"</div>") : "") +
				"</a>" +
			"</div>");
	}

	function loadContent(catalog) {
		$.getJSON("../" + catalog.source, function (content) {
			dataSource[catalog.id].content = content;
			$("#catalog-count-" + catalog.id).text("Total: " + content.length);
			for (let i = 0; i < content.length; ++i) {
				addContent(catalog, content[i]);
			}
		});
	}

	function addCatalog(catalog, active) {
		const isActive = active? "active" : "";
		const show = active? "show" : "";
		$("#catalog-nav").append(
			"<a class = 'list-group-item list-group-item-action " + isActive + "' id = 'catalog-" + catalog.id + "' href = '#catalog-content-" + catalog.id +
				"' role = 'tab' data-toggle = 'list' data-loaded = 'false'>" +
				"<img src = '" + catalog.icon + "' width = '24' alt=''>" + catalog.name +
			"</a>");
		$("#catalog-content").append(
			"<div class = 'tab-pane fade " + show + " " + isActive + "' role = 'tabpanel' id = 'catalog-content-" + catalog.id + "'>" +
				"<header>" +
					"<h1>" + catalog.name + "</h1>" +
					"<span class = 'badge badge-pill' id = 'catalog-count-" + catalog.id + "'></span>" +
					"<p>" + catalog.description + "</p>" +
					"<small class = 'tip'>(Para ver más fotos, haga click en cualquier imagen.)</small>" +
				"</header>" +
				"<div class = 'card-columns' id = 'content-" + catalog.id + "'></div>" +
			"</div>");
		const entry = $("#catalog-" + catalog.id);
		entry.on("hide.bs.tab", function (event) {
			$(this).find("img").attr("src", catalog.icon);
		});
		entry.click(function (event) {
			$(this).find("img").attr("src", catalog.iconActive);
			if ("true" !== this.getAttribute("data-loaded")) {
				loadContent(catalog);
				this.setAttribute("data-loaded", "true");
			}
		});
		if (active) {
			entry.click();
		}
	}

	_emailjs.init("user_vP6GnRzJr7w8EKGUQvS5I");

	_toastr.options = {
		"closeButton" : false,
		"debug" : false,
		"extendedTimeOut" : "1000",
		"hideDuration" : "1000",
		"hideEasing" : "linear",
		"hideMethod" : "fadeOut",
		"newestOnTop" : true,
		"onclick" : null,
		"positionClass" : "toast-top-right",
		"preventDuplicates" : false,
		"progressBar" : true,
		"showDuration" : "300",
		"showEasing" : "swing",
		"showMethod" : "fadeIn",
		"timeOut" : "5000"
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
			if (contactForm.parsley().isValid() === true) {
				sendButton.removeAttr("disabled");
			}
			else {
				sendButton.attr("disabled", "disabled");
			}
		});
		_document.getElementById("contact-form")
			.addEventListener("submit", function (event) {
				const thisForm = this;
				sendButton.html("<div class = 'spinner-border spinner-border-sm' role = 'status'/>");
				sendButton.attr("disabled", "disabled");
				event.preventDefault();
				thisForm.id.value = 1E+9 * Math.random() | 0;
				_emailjs.sendForm("Z6Dl67fFuCSKMjACs1jTfKnenHovoy5g", "W2ocWyuUVb32I2W8r6uwj8G6gzEG9xPZ", this)
					.then(function (response) {
						thisForm.reset();
						sendButton.html("Enviar");
						_toastr["success"]("Nos contactaremos con usted al número telefónico indicado, lo antes posible.",
							"Consulta enviada!");
					}, function (error) {
						sendButton.removeAttr("disabled");
						sendButton.html("Enviar");
						_toastr["error"]("Hubo un problema al enviar su consulta... ¡pero es nuestro!. Inténtelo nuevamente o dentro de unos minutos. ¿Tiene conexión a internet?",
							"Error al enviar consulta");
					});
			});
		$.getJSON("../data/repository.json", function (repository) {
			dataSource = repository;
			for (let i = 0; i < repository.length; ++i) {
				if (repository[i].type === "catalog") {
					addCatalog(repository[i], i === 0);
				}
			}
		});
		_anime({
			duration : 7500,
			easing : "linear",
			loop : true,
			rotateZ : 360,
			targets : ".animate"
		});
		$("#gallery-modal").on("show.bs.modal", function (event) {
			const gallery = $(this);
			const trigger = $(event.relatedTarget);
			const catalogId = trigger.attr("data-catalog");
			const contentId = trigger.attr("data-content");
			const oldCatalogId = gallery.attr("data-catalog");
			const oldContentId = gallery.attr("data-content");
			const galleryCatalog = gallery.find("#gallery-catalog");
			const galleryContent = gallery.find("#gallery-content");
			if (oldCatalogId === "") {
			}
			else if (oldCatalogId === catalogId && oldContentId === contentId) {
				return;
			}
			else {
				const oldTarget = dataSource[oldCatalogId].content[oldContentId];
				oldTarget.gallery.catalog = galleryCatalog.contents().detach();
				oldTarget.gallery.content = galleryContent.contents().detach();
			}
			const target = dataSource[catalogId].content[contentId];
			if (target.gallery === undefined) {
				target.gallery = {
					catalog : undefined,
					content : undefined
				};
				for (let i = 0; i < target.images.length; ++i) {
					const isActive = (i === 0)? "active" : "";
					galleryCatalog.append(
						"<li data-target = '#gallery' data-slide-to = '" + i + "' class = '" + isActive + "'></li>"
					);
					galleryContent.append(
						"<div class = 'carousel-item align-content-center " + isActive + "'>" +
							"<img src = '" + target.base + target.images[i] + "' class = 'd-block w-100' alt = ''>" +
						"</div>"
					);
				}
			}
			else {
				galleryCatalog.append(target.gallery.catalog);
				galleryContent.append(target.gallery.content);
			}
			gallery.attr("data-catalog", catalogId);
			gallery.attr("data-content", contentId);
		});
	});
})(document, anime, emailjs, toastr);
