/*! ModalJS | Copyright (c) 2020 Johnathan Bamber */
var Modal = function() {
	var eModal = null;
	
	var eFocusedDocument = null;
	var eFocusedModalFirst = null;
	var eFocusedModalLast = null;
	
	var config = {
		CSS: {
			classes: {
				active: 'modal-show',
				disable: 'modal-hide',
				close: 'modal-close'
			}
		}
	};
	
	function init(nId) {
		eModal = document.getElementById(nId);
		
		Array.from(eModal.getElementsByClassName(config.CSS.classes.close)).forEach(function(item) {
			item.addEventListener('click', function(event){
				close();
			});
		});
		
		eModal.addEventListener('keydown', handleKeyDown);
		eModal.addEventListener('click', function(event) {
			if (event.target == eModal) {
				close();
			}
		});
		
		return this;
	};
	
	function handleKeyDown(event) {
		switch(event.keyCode) {
			case 9:	// tab
				if (event.shiftKey) {
					if (document.activeElement == eFocusedModalFirst) {
						event.preventDefault();
						eFocusedModalLast.focus();
					}
				} else {
					if (document.activeElement == eFocusedModalLast) {
						event.preventDefault();
						eFocusedModalFirst.focus();
					}
				}
				break;
			case 27: // esc
				close();
				break;
			default:
				break;
		}
	}
	
	function open() {
		eFocusedDocument = document.activeElement;
		
		var eFocusable = Array.from(eModal.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'));
		
		eFocusedModalFirst = eFocusable[0];
		eFocusedModalLast = eFocusable[eFocusable.length - 1];

		addClass(eModal, config.CSS.classes.active);
		removeClass(eModal, config.CSS.classes.disable);
		
		var i = window.setInterval(function() { // visibility bug fix
			eFocusedModalFirst.focus();
			
			if (eFocusedModalFirst == document.activeElement) {
				clearInterval(i);
			}
		}, 20);
	};
	
	function close() {
		removeClass(eModal, config.CSS.classes.active);
		addClass(eModal, config.CSS.classes.disable);
		
		eFocusedDocument.focus();
	};
	
	function addClass(element, className) {
		var classes = element.className.split(' ');
		if (classes.indexOf(className) == -1) {
			element.className += " " + className;
		}
	};
	
	function removeClass(element, className) {
		var regex = new RegExp("\s?" + className + "\s?", "g");
		element.className = element.className.replace(regex, '').trim();
	};
	
	return {
		init:init,
		open:open,
		close:close
	};
}();

document.addEventListener('DOMContentLoaded', function() {
	document.querySelectorAll('[data-toggle="modal"]').forEach(function(item) {
		if (target = item.getAttribute('data-target')) {
			item.addEventListener('click', function(event) {
				Modal.init(target).open();
			});	
		}
	});
	
	document.querySelectorAll('.modal[data-auto="true"]').forEach(function(item) {
		window.setTimeout(function() {
			Modal.init(item.getAttribute('id')).open();
		}, 20);
	});
});