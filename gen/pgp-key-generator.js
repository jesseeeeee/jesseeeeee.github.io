window.onerror = function(msg, url, linenumber) {
	alert(msg);
	return true;
}

function encrypt() {
	var pubkey = jQuery('#pgp_key_generator_pubkey').val();
	var options, encrypted;
	options = {
		data: jQuery('#pgp_key_generator_message_encrypt').val(),
		publicKeys: openpgp.key.readArmored(pubkey).keys, armor: true
	};
	openpgp.encrypt(options).then(function(message) {
		jQuery('#pgp_key_generator_message_encrypt').val(message.data);
	});
	return false;
}

function generate() {
	var options = {
		userIds: [{ name: jQuery('#pgp_key_generator_username').val(), email: jQuery('#pgp_key_generator_mail_address').val() }],
		numBits: jQuery('#pgp_key_generator_key_length').val(),
		passphrase: jQuery('#pgp_key_generator_key_password').val()
	};
	openpgp.generateKey(options).then(function(key) {
		// success
		var privkey = key.privateKeyArmored;
		var pubkey = key.publicKeyArmored;
		jQuery('#pgp_key_generator_privgenkey').val(key.privateKeyArmored);
		jQuery('#pgp_key_generator_pubgenkey').val(key.publicKeyArmored);
	}).catch(function(error) {
		// failure
	});
	return false;
}

function decrypt() {
	var passphrase = jQuery('#pgp_key_generator_key_password_decrypt').val();
	var privKeys = openpgp.key.readArmored(jQuery('#pgp_key_generator_privkey').val());
	var privKey = privKeys.keys[0];
	var success = privKey.decrypt(passphrase);
	var message = openpgp.message.readArmored(jQuery('#pgp_key_generator_message_decrypt').val());
	options = {
		message: message,
		privateKey: privKey,
	};
	openpgp.decrypt(options).then(function (plaintext) {
		// success
		jQuery('#pgp_key_generator_message_decrypt').val(plaintext.data);
	}).catch(function(error) {
		// failure
		alert(error);
	});
	return false;
}

jQuery(document).ready(function(){
	jQuery("#pgp_key_generator_form1_button").click(function() { jQuery("#pgp_key_generator_form1").submit(); });
	jQuery("#pgp_key_generator_form1").validate({
		rules:{
			pgp_key_generator_username:{
				required: true
			},
			pgp_key_generator_mail_address:{
				required: true,
				email: true
			}
		},
		submitHandler: function(form) {
			return generate();
		}
	});
	
	jQuery("#pgp_key_generator_form2_button").click(function() { jQuery("#pgp_key_generator_form2").submit(); });
	jQuery("#pgp_key_generator_form2").validate({
		rules:{
			pgp_key_generator_message_encrypt:{
				required: true
			},
			pgp_key_generator_pubkey:{
				required: true
			}
		},
		submitHandler: function(form) {
			return encrypt();
		}
	});
	
	jQuery("#pgp_key_generator_form3_button").click(function() { jQuery("#pgp_key_generator_form3").submit(); });
	jQuery("#pgp_key_generator_form3").validate({
		rules:{
			pgp_key_generator_message_decrypt:{
				required: true
			},
			pgp_key_generator_privkey:{
				required: true
			}
		},
		submitHandler: function(form) {
			return decrypt();
		}
	});
});