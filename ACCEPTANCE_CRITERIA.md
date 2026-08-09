# 🧪 Acceptance Criteria

<b>1. Uploading the Cats</b>

Create a page at “/upload” that lets you upload a new cat image. <br/> 
```
[ ] Create an upload page on /upload

[ ] Be able to upload a picture of a cat from phone

[ ] Be able to upload a picture of a cat from computer
```
<br/> <br/> 


<b>2. Uploads the image to the /images/upload API endpoint.</b>
<br/><br/>

    [ ] Images should be uploaded to the images/upload API

<br/><br/>

<b>3. After uploading successfully it returns the user to the “/” page, otherwise it displays
validation errors and errors returned from API.</b>

    [ ] Calls the /images/ API endpoint

    [ ] Unsuccessful images should return message from API
   
    [ ] Successful image uploads should navigate to "/"

<br/>
<br/>

<b>4. Listing the Cats Create a page at “/” that lists the cat images that you have uploaded using /images/ API endpoint. 1. Display in a responsive way, up to a maximum of 4 cat images per row, it should neatly scale down to a 340px wide viewport and ensure images are not stretched.</b>



    [ ] Uploaded cats should be displayed on "/"

    [ ] Images on the "/" should only be from the /images/ API endpoint
   
    [ ] Images should be responsive

    [ ] Images should scale down to a 340px viewport

    [ ] Images should not be streched 
<br/><br/>
<b>3. Favoriting the Cats</b>

    [ ] Calls /favourites API endpoint
    [ ] On "/" have a favourite button

    [ ] User should be able to favourite or unfavourite the image
   
    [ ] Favourite button should be a heart

    [ ] Favourite button should be a heart that is ***filled*** when favorited

    [ ] Favourite button should be a heart that is ***unfilled*** when favorited

    [ ] Images should not be streched

    [ ] Text on the button should say favourite or unfavourite

<b>4. Voting the Cats</b>

    [ ] On "/" have a votes button

    [ ] Call the /votes API enpoint

    [ ] User should be able to ***upvote*** the image

    [ ] User should be able to ***downvote*** the image
   
    [ ] The score is equal to (Number of up votes - Number of down votes)





