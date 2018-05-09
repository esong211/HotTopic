# HotTopic

It will help you find what are popular around you

## An overview of the function of the code

### Back end

Input of the function has to be the string that represents latitude and longitude with comma separated (e.g. 11.342341, -84.129911). The function reads twitter credential from twitter.cred file and create twitter api object. Using the twitter api object and the input value, it searches for popular and recent tweets that are posted near from the input location and makes the result as a document. Then, it runs LDA on the document and finds most appropriate appropriate topics. It uses the topics as a query and searches and selects most popular tweets and returns top 3 of them. 

### Front end

The front end get the latitude and longitude data from the user, and it passes the data to the backend algorithm which is LDA and the crawling the Twitter. After backend finishes the process, it display the result to the user. 

## How the software is implemented?
The system receives value of latitude and longitude from a user. When a user clicks the button to find hot topics around him or her, the front end open a socket with Node.js backend and sends the input values. After receiving the values, backend calls twitter_api function in script.py to get hot topics around the user. The twitter_api function searches popular and recent tweets without any specific queries using twitter credential given in the package. Then, the function runs LDA with the queried tweets and finds top 1 topic of 3 words. With same location information, it searches for top 3 popular tweets by using the each word in a topic as a query. After finding the hot topic, the backend creates and passes the topics in JSON object using the socket. Once the front end receives the topics, it displays the topics to users. 

## Prerequisites

### Back end

**Tweepy**: In order to get tweets in the given location with popular topic, we used Tweepy library. We used Tweepy.Cursor to get data for the analyze. 
installation : 
```
pip install tweepy
```

**Gensim** : We used LDA Model inside of Gensim library. 
installation : 
```
pip install tweepy
```

**NLTK** : We used NLTK library to do the lemmatization of the words. 
installation : 
```
pip install nltk
```

**TextBlob** :We used TextBlob in order eliminate the verbs in the tweets because verbs are not usually related to the topic. 
installation : 
```
pip install textblob
```

**JSON** : We used Json Library to format the data into the json format. We changed to JSON format because it is easier to parse the data in the front end. 

**Node.js**: Used for opening and listening promised sockets
Installation: Download at the following link
              https://nodejs.org/en/
Usage: node src/server.js


### Front end

**Node.js**: Used for opening and listening promised sockets

**NPM**: Used for front end package management
installation: 
```
npm install
```
Usage: 
```
npm start
```

# How to use?
1. Install all required libraries and frameworks
2. User open the terminal and run the src/server.js 
3. Open up the localhost:8000 in the web browser. 
4. put your location as latitude on the first blank and longitude for the second black
5. Then, user will get the result tweets at the bottom. 


## Contributors
Front-end = Alvin Chang 
Setting up LDA, Crawl from Twitter = Eric Song, Jeewoon Han. 
