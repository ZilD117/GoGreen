(function() {

    function getCookie(cookieName) {
        var re = new RegExp(cookieName + "=([^;]+)");
        var value = re.exec(document.cookie);
        return (value != null) ? window.decodeURI(value[1]) : null;
    }

    function getConsent(event) {

        try{

            // Only pop the Consent question if consentTracking is neither true nor false 
            if(!(getCookie('consentTracking') == 'true' || getCookie('consentTracking') == 'false')) {
                var htmlString = '<!-- Modal -->'
                + '<div id="CMSGDPRNotice" role="dialog" style="display: block;">'
                + '<div class="content row py-2">'
                + '<div class="consent-body-wrapper text-center mb-1 mx-5 mx-sm-auto">'
                + '<div class="consent-body">This site uses cookies to improve browsing experience. Do you consent?</div>'
                + '<div class="button-wrapper px-2">'
                + '<button class="affirm btn btn-primary mr-1" data-answer="Yes">Yes</button>'
                + '<button class="decline btn btn-primary" data-answer="No">No</button>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>'; 
                
                const gdprDiv = document.createElement("div");
                gdprDiv.id = "CMSGDPRNotice";
                gdprDiv.innerHTML = htmlString;

                document.body.appendChild(gdprDiv);
                
                const buttons = Array.prototype.slice.apply(document.querySelectorAll("#CMSGDPRNotice .button-wrapper button"));
                buttons.forEach(element => {
                    element.addEventListener("click", function(e) {

                        try{

                            e.preventDefault();
                            var answer = e.target.innerText;

                            if(answer==="Yes") {

                                // set consentTracking = true
                                document.cookie = "consentTracking=true;path=/;domain=mit.edu";      //  set on domain  executive.mit.edu .... cannot set


                                
                            }
                            else {
                                // set consentTracking = false
                                document.cookie = "consentTracking=false;path=/;domain=mit.edu";      //  set on domain  executive.mit.edu .... cannot set

                            }
                        
                        }
                        catch (err) {                
                            console.error(err);
                        }
            
                        document.body.removeChild(gdprDiv);
            
                
                    });
                });
            }

        }
        catch(erxx) {
            console.error(erxx);
        }

    }

    try {

        console.log("ready state: " + document.readyState);
        
        if (document.readyState=='loading'){
            window.addEventListener('DOMContentLoaded', (event) => {
                getConsent(event);
            });    
        }
        else {
            getConsent(null);
        }
    
    }
    catch (ferr) {
        console.error(ferr);
        getConsent(null);
    }


    
})();



