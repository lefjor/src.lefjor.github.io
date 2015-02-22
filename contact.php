<?php session_start(); ?>
<style>
        /* CSS Document */

        /* ---------- FONTAWESOME ---------- */
        /* ---------- http://fortawesome.github.com/Font-Awesome/ ---------- */
        /* ---------- http://weloveiconfonts.com/ ---------- */

    @import url(http://weloveiconfonts.com/api/?family=fontawesome);
        /* ---------- ERIC MEYER'S RESET CSS ---------- */
        /* ---------- http://meyerweb.com/eric/tools/css/reset/ ---------- */
    @import url(http://meyerweb.com/eric/tools/css/reset/reset.css);

        /* ---------- FONTAWESOME ---------- */

    [class*="fontawesome-"]:before {
        font-family: 'FontAwesome', sans-serif;
    }

        /* ---------- GENERAL ---------- */

    body {
        background-color: #eee;
        color: #000;
        font-family: "Varela Round", Arial, Helvetica, sans-serif;
        font-size: 16px;
        line-height: 1.5em;
    }

    input, textarea {
        border: none;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        -webkit-appearance: none;
    }

        /* ---------- LOGIN ---------- */

    #login {
        /*margin: auto;*/
        width: 400px;
    }

    #login h2 {
        background-color: #2F2F2F;
        color: #fff;
        font-size: 28px;
        padding: 20px 20px;
        text-align: center;
    }

    #login h2 span[class*="fontawesome-"] {
        margin-right: 14px;
    }

    #login fieldset {
        background-color: #eee;
        -webkit-border-radius: 0 0 20px 20px;
        -moz-border-radius: 0 0 20px 20px;
        border-radius: 0 0 20px 20px;
        padding: 20px 26px;
    }

    #login fieldset p {
        color: #777;
        margin-bottom: 14px;
    }

    #login fieldset p:last-child {
        margin-bottom: 0;
    }

    #login fieldset input, #login fieldset textarea {
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }

    #login fieldset input, #login fieldset textarea {
        background-color: #fff;
        color: #777;
        padding: 4px 10px;
        width: 340px;
        resize: none;
    }

    #login fieldset input[type="submit"] {
        background-color: #33cc77;
        color: #fff;
        display: block;
        margin: 0 auto;
        padding: 4px 0;
        width: 100px;
    }

    #login fieldset input[type="submit"]:hover {
        background-color: #28ad63;
        cursor: pointer;
    }

    #login fieldset p.red {
        background-color: #D45252;
        color: #FFFFFF;
        text-align: center;
    }

  /*  :-moz-placeholder {
        color: #eee;
    }

    ::-webkit-input-placeholder {
        color: #eee;
    }*/

    input:required, textarea:required {
        background: #fff url(./img/ico/red_asterisk.png) no-repeat 98% center;
    }

    .contact_form input:focus:invalid, .contact_form textarea:focus:invalid { /* when a field is considered invalid by the browser */
        background: #fff url(./img/ico/invalid.png) no-repeat 98% center;
        box-shadow: 0 0 5px #d45252;
        border-color: #b03535
    }

    .contact_form input:required:valid, .contact_form textarea:required:valid { /* when a field is considered valid by the browser */
        background: #fff url(./img/ico/valid.png) no-repeat 98% center;
        box-shadow: 0 0 5px #5cd053;
        border-color: #28921f;
    }

</style>

<?php
/*
	********************************************************************************************
	CONFIGURATION
	********************************************************************************************
*/
// destinataire est votre adresse mail. Pour envoyer à plusieurs à la fois, séparez-les par une virgule
$destinataire = 'lefjor@gmail.com';

// copie ? (envoie une copie au visiteur)
$copie = 'oui';

// Action du formulaire (si votre page a des paramètres dans l'URL)
// si cette page est index.php?page=contact alors mettez index.php?page=contact
// sinon, laissez vide
$form_action = '';

// Messages de confirmation du mail
$message_envoye = "Votre message nous est bien parvenu !";
$message_non_envoye = "L'envoi du mail a échoué, veuillez réessayer SVP.";

// Message d'erreur du formulaire
$message_formulaire_invalide = "Vérifiez que tous les champs soient bien remplis et que l'email soit sans erreur.";

$class = 'empty';


/*
	********************************************************************************************
	FIN DE LA CONFIGURATION
	********************************************************************************************
*/

/*
 * cette fonction sert à nettoyer et enregistrer un texte
 */
function Rec($text)
{
    $text = htmlspecialchars(trim($text), ENT_QUOTES);
    if (1 === get_magic_quotes_gpc()) {
        $text = stripslashes($text);
    }

    $text = nl2br($text);
    return $text;
}

;

/*
 * Cette fonction sert à vérifier la syntaxe d'un email
 */
function IsEmail($email)
{
    $value = preg_match('/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9_](?:[a-zA-Z0-9_\-](?!\.)){0,61}[a-zA-Z0-9_-]?\.)+[a-zA-Z0-9_](?:[a-zA-Z0-9_\-](?!$)){0,61}[a-zA-Z0-9_]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/', $email);
    return (($value === 0) || ($value === false)) ? false : true;
}

// formulaire envoyé, on récupère tous les champs.
$nom = (isset($_POST['nom'])) ? Rec($_POST['nom']) : '';
$email = (isset($_POST['email'])) ? Rec($_POST['email']) : '';
$objet = (isset($_POST['objet'])) ? Rec($_POST['objet']) : '';
$message = (isset($_POST['message'])) ? Rec($_POST['message']) : '';

$antispam_h = (isset($_POST['antispam_h'])) ? Rec($_POST['antispam_h']) : '';
$antispam_r = (isset($_POST['antispam_r'])) ? Rec($_POST['antispam_r']) : '';

// On va vérifier les variables et l'email ...
$email = (IsEmail($email)) ? $email : ''; // soit l'email est vide si erroné, soit il vaut l'email entré
$err_formulaire = false; // sert pour remplir le formulaire en cas d'erreur si besoin

if (isset($_POST['envoi'])) {
    // Si l'utilisateur a bien entré un code
    if (!empty($_REQUEST['code'])) {
        // Conversion en majuscules
        $code = strtoupper($_REQUEST['code']);

        // Cryptage et comparaison avec la valeur stockée dans $_SESSION['captcha']
        if (md5($code) == $_SESSION['captcha']) {
            $class = 'correct'; // Le code est bon

            if (($nom != '') && ($email != '') && ($objet != '') && ($message != '')) {
                // les 4 variables sont remplies, on génère puis envoie le mail
                $headers = 'From:' . $nom . ' <' . $email . '>' . "\r\n";
                //$headers .= 'Reply-To: '.$email. "\r\n" ;
                //$headers .= 'X-Mailer:PHP/'.phpversion();

                // envoyer une copie au visiteur ?
                if ($copie == 'oui') {
                    $cible = $destinataire . ',' . $email;
                } else {
                    $cible = $destinataire;
                };

                // Remplacement de certains caractères spéciaux
                $message = str_replace("&#039;", "'", $message);
                $message = str_replace("&#8217;", "'", $message);
                $message = str_replace("&quot;", '"', $message);
                $message = str_replace('<br>', '', $message);
                $message = str_replace('<br />', '', $message);
                $message = str_replace("&lt;", "<", $message);
                $message = str_replace("&gt;", ">", $message);
                $message = str_replace("&amp;", "&", $message);

                // Envoi du mail
                if (mail($cible, $objet, $message, $headers)) {
                    $messageErreur = $message_envoye;
                } else {
                    $messageErreur = $message_non_envoye;
                };
            } else {
                // une des 3 variables (ou plus) est vide ...
                $messageErreur = $message_formulaire_invalide;
                $err_formulaire = true;
            };

        } else {
            $class = 'incorrect'; // Le code est erroné
            $messageErreur = 'Vous n\'avez pas répondu correctement à la question antispam ...';
        }
    } else {
        $class = 'incorrect'; // Aucun code
        $messageErreur = 'Vous n\'avez pas répondu à la question antispam ...';
    }
}; // fin du if (!isset($_POST['envoi']))
?>


<div id="login">
    <h2><span class="fontawesome-lock"></span>Contact</h2>

    <form class="contact_form" method="post" action="<? $form_action ?>">
        <fieldset>
            <p class="red"><? echo $messageErreur; ?></p>
            <p>
                <label for="nom">Nom :</label>
                <input type="text" id="nom" name="nom" value="<? stripslashes($nom) ?>" tabindex="1"
                       placeholder="John Doe" required autofocus/>
            </p>

            <p>
                <label for="email">Mail :</label>
                <input type="email" id="email" name="email" value="<? stripslashes($email) ?>" tabindex="2"
                       placeholder="john_doe@example.com" required/>
            </p>

            <p>
                <label for="objet">Objet :</label>
                <input type="text" id="objet" name="objet" value="<? stripslashes($objet) ?>" tabindex="3"
                       placeholder="Un petit mot ..." required/>
            </p>

            <p>
                <label for="message">Message :</label>
                <textarea id="message" name="message" tabindex="4" cols="30" rows="8" tabindex="4"
                          placeholder="Votre message ..." required><? stripslashes($message) ?></textarea>
            </p>

            <p style="text-align: center;">
                <img src="./php/captcha.php" alt="Captcha" id="captcha"/>
                <img src="./img/captcha/reload.png" alt="Recharger l'image" title="Recharger l'image"
                     style="cursor:pointer;position:relative;top:-7px;"
                     onclick="document.images.captcha.src='./php/captcha.php?id='+Math.round(Math.random(0)*1000)"/></p>

            <p>
                <label for="code">Anti-spam :</label>
                <input name="code" class="<? $class ?>" type="text" tabindex="5" required pattern="^[a-zA-Z0-9-+_\.]{5}$" placeholder="Code antispam"/>
            </p>

            <p>
                <input type="submit" name="envoi" value="Envoyer"/>
            </p>
        </fieldset>
    </form>
</div>

