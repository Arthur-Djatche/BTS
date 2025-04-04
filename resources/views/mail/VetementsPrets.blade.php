<!DOCTYPE html>
<html>
<head>
    <title>Vos vêtements sont prêts</title>
    <style>
        /* Styles basiques compatibles pour les emails */
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #4CAF50;
            text-align: center;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background-color: #f7f7f7;
        }
        .color-box {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 4px;
            margin-left: 8px;
            vertical-align: middle;
            border: 1px solid #ddd;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bonjour, {{ $lavage['client']['nom'] }} {{ $lavage['client']['prenom'] }}</h1>
        <p>Nous avons le plaisir de vous informer que vos vêtements du lavage {{ $lavage['id'] }} sont prêts. Vous pouvez venir les récupérer à tout moment.</p>



        <p class="footer">Merci de nous avoir fait confiance. À très bientôt !</p>
    </div>
</body>
</html>
