/* Adaptor layer that tries to import the score button from Rainey Arcade and allows it to fail */
export let send_score, hide_send_score_button;

class MissingModule extends Error {}

const loadModule = async (modulePath) => {
    try {
        return await import(modulePath)
    } catch (e) {
        throw new MissingModule(modulePath)
    }
}

loadModule("../send_score.js").then(send_score_module => {
    send_score = send_score_module.send_score;
    hide_send_score_button = send_score_module.hide_send_score_button;
    /*
    function show_send_score_button() {
        // If embedded on Rainey Arcade, integrate with the send_score_button
        const send_score_button = document.getElementById("send_score_button");
        if (send_score_button) {
            function sendScore(e) {
                send_score(
                    document.getElementById("game_title").dataset.filename,
                    score,
                    send_score_button.dataset.csrfToken,
                );
                e.currentTarget.setAttribute("style", "display: none;");
                e.currentTarget.removeEventListener("click", sendScore);
                e.stopPropagation();
            }
            send_score_button.setAttribute("style", "z-index: 100; display: block; left: 50%; bottom: 30%; transform: translate(-50%);");
            send_score_button.addEventListener("click", sendScore);
        }
    }*/
}).catch((e) => {
    console.log("Failed to import score button functionality");
    send_score = () => null;
    hide_send_score_button = () => null;
})