import React, { Component } from 'react';
import getIcon from './collectionIcons';
import QuizCollectionItem from './QuizCollectionItem';
import QuizList from './QuizList';

export default class QuizCollection extends Component {

    constructor(props) {
        super(props);
        this.getIcon = getIcon;
        this.state={}
        this.showTopics  = this.showTopics.bind(this);
        //this.discoverByDifficulty  = this.discoverByDifficulty.bind(this);
        //this.discoverOneByDifficulty  = this.discoverOneByDifficulty.bind(this);
        //this.discoverByTopics  = this.discoverByTopics.bind(this);
        this.discoverOneByTopics  = this.discoverOneByTopics.bind(this);
        this.showCollection  = this.showCollection.bind(this);
        this.hideCollection  = this.hideCollection.bind(this);
    }
    
    showTopics(collectionName) {
        this.setState({showTopic:collectionName});
    };
    
    //discoverByDifficulty(difficulty) {
     ////   this.props.(difficulty);
    //};
    
    showCollection(collection) {
        this.setState({collection:collection});
    };
    
    hideCollection() {
        this.setState({collection:null});
    };
    
    
    discoverOneByDifficulty(difficulty) {
      let that = this;
      let url='/api/discover';
      let rand=Math.random()
      return fetch(url,{ method: "POST",headers: {
            "Content-Type": "application/json"
            },
            body:JSON.stringify({
                difficulty:difficulty,
                user:(this.props.user ? this.props.user._id : ''),
                rand:rand,
                limit:20
            })
        })
      .then(function(response) {
        return response.json()
      }).then(function(json) {
          if (json && json.questions && json.questions.length > 0) {
              let selected = parseInt(Math.random()*json.questions.length , 10);
              console.log(['SEL RAND',selected,json.questions]);
              return json.questions[selected];
          } else {
              return {question:"You've seen all these questions"}
          }
        
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
    };
    
    
    
    discoverOneByTopics(topics) {
        let that = this;
      let url='/api/discover';
      let rand=Math.random()
      return fetch(url,{ method: "POST",headers: {
            "Content-Type": "application/json"
            },
            body:JSON.stringify({
                topics:topics.join(","),
                user:(that.props.user ? that.props.user._id : ''),
                rand:rand,
                limit:20
            })
        })
      .then(function(response) {
        return response.json()
      }).then(function(json) {
          if (json && json.questions && json.questions.length > 0) {
              let selected = parseInt(Math.random()*json.questions.length , 10);
              console.log(['SEL RAND',selected,json.questions]);
              return json.questions[selected];
          } else {
              return {question:"You've seen all these questions"}
          }
        
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
    };
    
    
    
    render() {
        if (this.state.collection) {
            let collection = this.state.collection;
            if (collection.topics) {
              let collatedTopics={};
              collection.topics.forEach(function(topic) {
                  collatedTopics[topic]=1;
              });
              return <div  >
                      <h4>{collection.name}</h4>
                      <QuizList quizzes={collatedTopics} setQuiz={this.props.setQuiz} questionsMissingMnemonics={this.props.questionsMissingMnemonics}   setQuizFromMissingMnemonic={this.props.setQuizFromMissingMnemonic}></QuizList>
                    </div>
            }
        } else {
            //let iconSize=36;
            //topics={['aa','bb','cc']
            let collectionsIn = [
            {name:'Academic', color:'black', backgroundColor:'#fc0',icon:'graduationCap',topics:['Academic Research 2018']},
            {name:'Australian News', color:'black', backgroundColor:'#ff0',icon:'globeAsia',topics:['Australian News']},
            {name:'World News', color:'black', backgroundColor:'#98cb00',icon:'globe',topics:['World News']},
            {name:'Language', color:'black', backgroundColor:'#090',icon:'language',topics:["Hello Across the World","Hello Across the World 2","Mnemo's Chinese Vocabulary","Mnemo's Japanese Vocabulary","Mnemo's Japanese Kanji Characters","2000 Kanji","Mnemo's Dictionary","English Vocab (junior high school)","English Vocab (senior high school)","What is another word for","International Phonetic Alphabet","Mnemo's Writing Lessons","Kanji: less common","Grammar"]},
            {name:'Encyclopaedia', color:'black', backgroundColor:'#0099cb',icon:'book',topics:["Mnemo's America","Mnemo's Architecture","Mnemo's Anatomy","Mnemo's Art","Mnemo's Astronomy","Mnemo's Australia","Mnemo's Biology","Mnemo's Buddhism","Mnemo's Business","Mnemo's Chemistry","Mnemo's China","Mnemo's Christianity","Mnemo's Computing","Mnemo's Economics","Mnemo's Education","Mnemo's Ethics","Mnemo's Finance","Mnemo's France","Mnemo's Geography","Mnemo's Geology","Mnemo's Greece","Mnemo's History","Mnemo's Islam","Mnemo's Japan","Mnemo's Judaism","Mnemo's Law","Mnemo's Liberalism","Mnemo's Literature","Mnemo's Mathematics","Mnemo's Music","Mnemo's Mythology","Mnemo's Philosophy","Mnemo's Phrases","Mnemo's Physics","Mnemo's Politics","Mnemo's Psychology","Mnemo's Religion","Mnemo's Rome","Mnemo's Science","Mnemo's Society","Mnemo's War","Mnemo's Women of the World"]}, 
            {name:'Facts and Figures', color:'white', backgroundColor:'#0066cb',icon:'database',topics:["Remember the Mnemonic Major System","Capital Cities","Capital Cities 2","Colour Names","Colour Visualisation","Colour Visualisation (obscure colours)","NATO Phonetic Alphabet","Constellation Meanings","Name that famous constellation","Name that constellation","Constellation Brightest Stars","The Elements","Human organs","Inventions","International System of Units"]},
            {name:'Law', color:'white', backgroundColor:'#000098',icon:'balanceScale',topics:["Law terms @ Wikipedia","Law terms @ Google","Australian Constitutional Law Key Cases","Australian Constitutional Law Cases","Australian Constitution Key Sections","Australian Constitution Other Sections","MemoryFoam's Australian Guide to Legal Citation 3","Great Crimes and Trials","Australian High Court cases (mostly non-constitutional)"]}
            ];
            let renderedTopicCollections = null;
            //let collectionIn = this.props.collection;
            //this.props.setQuizFromTopics(collection.topics)
            if (Array.isArray(collectionsIn)) {
                
                renderedTopicCollections = collectionsIn.sort(function(a,b) {
                    if (a.sort < b.sort) return -1;
                    else if (a.sort > b.sort) return 1;
                    else return 0;
                }).map((collection, key) => {
                  return <QuizCollectionItem key={key}  color={collection.color} backgroundColor={collection.backgroundColor}  icon={collection.icon} name={collection.name} topics={collection.topics} onClick={(e) => this.showCollection(collection)} loadQuestionByTopics={this.discoverOneByTopics} setQuizFromQuestionId={this.props.setQuizFromQuestionId} /> 
                })
            }
                        
            
            let blockStyle={minHeight:'150px',border:'2px solid white',fontSize:'1.1em',paddingTop:'0.2em',fontWeight:'bold'}
            return  (
            <div className="splash" >
                <div className="row" >
                    <QuizCollectionItem color="white" backgroundColor='#fe0000' icon="chalkBoard" name="Beginner" difficulty="1" onClick={(e) => this.props.setQuizFromDifficulty(1)} loadQuestionByDifficulty={this.discoverOneByDifficulty} setQuizFromQuestionId={this.props.setQuizFromQuestionId} /> 
                    <QuizCollectionItem color="white" backgroundColor='#f60'  icon="userGraduate" name="Advanced" difficulty="2" onClick={(e) => this.props.setQuizFromDifficulty(2)} loadQuestionByDifficulty={this.discoverOneByDifficulty} setQuizFromQuestionId={this.props.setQuizFromQuestionId} /> 
                    <QuizCollectionItem color="black" backgroundColor='#fe9900'  icon="brain" name="Genius" difficulty="3" onClick={(e) => this.props.setQuizFromDifficulty(3)} loadQuestionByDifficulty={this.discoverOneByDifficulty} setQuizFromQuestionId={this.props.setQuizFromQuestionId} /> 
                   
                    
                    {renderedTopicCollections}
            
                    
                    
                    <QuizCollectionItem color="white" backgroundColor='#670099'  icon="userFriends" name="Community"  onClick={(e) => this.hideCollection()} loadQuestionByAll={this.discoverOneByDifficulty} setQuizFromQuestionId={this.props.setQuizFromQuestionId} /> 
                                        
                    <QuizCollectionItem color="white" backgroundColor='#cd0067'  icon="starOfLife" name="All"  onClick={(e) => this.props.setQuizFromDiscovery()} loadQuestionByAll={this.discoverOneByDifficulty} setQuizFromQuestionId={this.props.setQuizFromQuestionId} /> 
                </div>
            </div>
        )
            
        }

    }



    //drender() {
        //if (Array.isArray(this.props.collection)) {
            
            //let collectionsCol1 = this.props.collection.sort(function(a,b) {
                //if (a.sort < b.sort) return -1;
                //else if (a.sort > b.sort) return 1;
                //else return 0;
            //}).map((collection, key) => {
                ////console.log([collection,key]);
              //if (collection.topics && collection.column==="1") {
                  //let collatedTopics={};
                  //collection.topics.forEach(function(topic) {
                      //collatedTopics[topic]=1;
                  //});
                  //return <div   key={key} >
                          //<h4>{collection.name}</h4>
                          //<QuizList quizzes={collatedTopics} setQuiz={this.props.setQuiz} questionsMissingMnemonics={this.props.questionsMissingMnemonics}   setQuizFromMissingMnemonic={this.props.setQuizFromMissingMnemonic}></QuizList>
                        //</div>
              //}
              //return '';
              
            //})
            
             //let collectionsCol2 = this.props.collection.map((collection, key) => {
                ////console.log([collection,key]);
              //if (collection.topics&& collection.column!=="1") {
                  //let collatedTopics={};
                  //collection.topics.forEach(function(topic) {
                      //collatedTopics[topic]=1; 
                  //});
                  //return <div   key={key} >
                          //<h4>{collection.name}</h4>
                          //<QuizList quizzes={collatedTopics} setQuiz={this.props.setQuiz}  questionsMissingMnemonics={this.props.questionsMissingMnemonics}   setQuizFromMissingMnemonic={this.props.setQuizFromMissingMnemonic}></QuizList>
                        //</div>
              //}
              //return '';
            //})
            
            ////<a onClick={() => this.props.setQuiz()}  href="#"  className="btn btn-info" style={{float:'right'}}  >More</a>
            //return (
              //<div className="quiz-collection-questions row">
                //<div className="col-6" >
                  //{
                    //collectionsCol1
                  //}
                //</div>
                //<div className="col-6" >
                  //{
                    //collectionsCol2
                  //}
                //</div>
              //</div>
            //)
        //} else {
            //return null
        //}
        
        
    //};
}
