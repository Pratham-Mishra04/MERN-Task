'strict mode';

// Updated Constants
const backendBaseUrl = 'http://localhost:8000';
const imagesRoute = '/exhibitions';
const publicImageRoute = '/exhibitions';

module.exports = {
    // Updated fetchList Function
    fetchList: async function (from, count) {

        const urlParams = new URLSearchParams(window.location.search);
        const userID = urlParams.get('userID');
    
        if (!userID || userID=="") {
            // Handle the case where userID is not provided in the URL
            alert('userID is missing in the URL parameters');
            return [];
        }

        const url = `${backendBaseUrl}${imagesRoute}?userID=${userID}&limit=100`;
        const json = await fetch(url, {
            mode:  'cors',
            method: 'GET',
        }).then(res => res.json()).catch(err=>{
            alert("An error occurred")
            console.log(err)
        });
    
        // Assuming your backend provides an array of ExhibitionDocument
        const exhibitions = json.exhibitions.slice(from, from + count);
    
        // Create an array of "virtual" paintings using relevant information from exhibitions
        const paintings = exhibitions.map((exhibition, index) => ({
            image_id: index + from,   // Use an index or any unique identifier as image_id
            title: exhibition.title,  // Use the exhibition title or customize as needed
            artist_title: exhibition.category, // Use exhibition category or customize as needed
            image_url: exhibition.image
            // Other relevant fields as needed
        }));
    
        return paintings;
    },

    // Updated fetchImage Function
    fetchImage: async function (obj, advicedResolution) {
        const url = backendBaseUrl + publicImageRoute + `/${obj.image_url}`;
        const blob = await fetch(url).then(res => res.blob());

        return {
            title: obj.title,
            image: blob
        };
    },

}