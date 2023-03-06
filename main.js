"use strict";

(() => {

    window.getResponse = async function () {
        try {
            event.preventDefault();
            const languageBox = document.getElementById("languageBox")
            const difficultyBox = document.getElementById("difficultyBox")
            const countBox = document.getElementById("countBox")

            const language = languageBox.value;
            const difficulty = difficultyBox.value;
            const count = countBox.value;

            const prompt = promptEngineering(language, difficulty, count);
            const completion = await getCompletion(prompt);

            // Display:
            humanLikeWriting(completion);

        } catch (err) {

            alert(err.message);
        }
    }

    // Writing animation:
    async function humanLikeWriting(completion) {
        let text = "";
        for (let i = 0; i < completion.length; i++) {
            text += completion[i];
            responseDiv.innerHTML = text;
            await delay(5);
        }
        const print = document.getElementById("printButton")
        print.style.visibility = "visible";
    }

    // Delay for humanLikeWriting:
    function delay(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, ms)
        });
    }

    function promptEngineering(language, difficulty, count) {
        // Prompt - text we send to ChatGPT
        let prompt = `
    Write ${count} job interview questions and answers for ${language} programming language.
    Suitable for ${difficulty} difficulty level.
    Start each question in new HTML paragraph, make its font weight bold.
    From new line, answer the questions and hide them in cascade menu.
    `;
        return prompt;
    }

    // Print responseDiv contents
    window.printDiv = function () {
        const contents = document.getElementById("responseDiv").innerHTML;
        const frame = document.createElement("iframe");
        frame.style.display = "none";
        document.body.appendChild(frame);
        frame.contentDocument.write("<html><head><title></title></head><body>" + contents + "</body></html>");
        frame.contentWindow.print();
        document.body.removeChild(frame);
    }

    // POST options:
    async function getCompletion(prompt) {

        const loader = document.getElementsByClassName("loader")[0];
        loader.style.visibility = "visible";

        // API key:
        const apiKey = "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";

        // URL:
        const url = "https://api.openai.com/v1/completions";

        // Request body:
        const body = {
            prompt,
            model: "text-davinci-003",
            max_tokens: 2500 // Max tokens return in completion (returned answer);
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + apiKey
            },
            body: JSON.stringify(body)
        };
        // Get response:
        const response = await fetch(url, options);

        // Extract JSON:
        const json = await response.json();

        // If there is some error:
        if (response.status >= 400) throw json.error;

        // Extract completion:
        const completion = json.choices[0].text;

        loader.style.visibility = "hidden";
        // Return completion - The text ChatGPT return from the prompt
        return completion;
    }

})();