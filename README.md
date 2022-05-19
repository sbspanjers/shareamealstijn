# Share a Meal API

[![Deploy to Heroku](https://github.com/avansinformatica/programmeren-4-shareameal/actions/workflows/main.yml/badge.svg)](https://github.com/sbspanjers/shareamealstijn/actions/workflows/main.yml)

## Beschrijving

Deze API is gemaakt om gebruikers en maaltijden toe tevoegen, te updaten of te verweideren. Share a Meal is een coole app waar iedereen maaltijd kan toevoegen en delen met de rest van de gebruikers. Deze API zorgt dat de app kan communiceren met de database waar alles wordt opgeslagen.

## Installatie

Om deze API te kunnen gebruiken kan je deze Github repository clonen. Als de repository eenmaal is gecloned, dan kun je de code in bijvoorbeeld Visual Studio Code openen om ermee aan de slag te gaan. Allereerst is het belangrijk om in de terminal 'npm install' te typen. Daarmee download je de npm server die je nodig hebt voor deze API. Na het installeren van npm kan je meerdere npm onderelen installeren, zoals chai, assert, bcrypt en jwt. Om deze onderdelen te download moet je telkens 'npm install ...' typen, op de ... moet je de naam typen van datgene dat je wilt downloaden. Dus bijvoorbeeld: 'npm install chai'. Als je gebruik wilt maken van een lokale database is het handig om XAMPP te downloaden, die is op internet te downloaden. Om de database op te maken is het 'share-a-meal.sql' bestand te gebruiken, daarmee wordt de database aangemaakt en wordt er al testdata ingezet. Als laatste is het handig om Postman te downloaden, daarmee kan je requests sturen om de applicatie te testen.

## Gebruik

Als je het programma wilt laten draaien moet je in de terminal 'npm start' typen. Dan gaat het programma luisteren of er POST, GET of PUT requests zijn en zal daar dan op reageren. Daarna moet je op XAMPP de Apache en de MySql server starten. Als dat is gelukt is de volgende stap Postman. Daarin kan je de requests typen die je wilt testen. Een voorbeeld is 'http://localhost:3000/', als alles werkt zou de uitkomst 'status: 200, result: Hellooo World!' moeten zijn. Hieronder staan nog meer voorbeelden om de applicatie te gebruiken:

[![usage](https://images-ext-1.discordapp.net/external/_EDJaGbT-HHR82YZEXF9A0EyuOWU7cRgquO_hUK6A14/https/i.imgur.com/5QSFCjrh.jpg)](https://shareameal-api.herokuapp.com/docs/#/)

## Project status

Dit project is gemaakt in periode 4 van Informatica op het Avans in Breda. Het project is aan het eind van die periode afgerond en wordt nu daarom ook niet meer geupdate. De applicatie is nogsteeds te gebruiken als deze van de Github wordt gecloned of gedownload.
