

import React, { Component } from 'react';

var $=window.jQuery;
var jQuery=window.jQuery;




/*
Speechify 
Author: Steve Ryan <stever@syntithenai.com>
Date: 5/2013
// This plugin simplifies adding speech access to a HTML page.
// It adds focus/blur events to input,textarea and designMode elements to trigger voice input to replace the selected text
	// Text injection auto spaces
// Stop listening/start listening/pause listening
// Auto buttons/links - highlight and trigger for selection with OK or click
// Command structure/grammar configurable tree of methods

*/	
function SpeechifySuccessException(grammar,variables) {
	this.grammar = grammar;
	this.variables = variables;
}
function SpeechifyGrammarException(message) {
	this.message = message;
}

var SpeechifyGrammar = function SpeechifyGrammar(texts,callback) {
	this.texts = texts;
	this.callback = callback;
};

var speechifyPlugin = function($) {
			var restartCount = 0;
			var imageSearch;
			var recognising=false;
			var pendingCommand=false;
			var handlerStarted=false;
			var transcript = '';
			var captureType='';
			var captureTarget=null;
			//var lastStartedAt = 0;
			var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
			if (!SpeechRecognition) {
				console.log('Speech recognition not enabled in this browser');
				return null;
			}
			var speechRecognitionHandler = new SpeechRecognition();
			var options = {};
			
			
			// PRIVATE FUNCTIONS
			function isVariable(word) {
				if (word.substr(0,1) == "$") {
					return true;
				} else {
					return false;
				}
			}
			
			function hasVariable(current) {
				for (name in current) {
					if (isVariable(name)) {
						return true;
					}
				}
				return false;
			}
			function getVariables(current) {
				var variables = [];
				for (name in current) {
					if (isVariable(name)) {
						variables.push(name);
					}
				}
				return variables;
			}
			function isGrammarNode(node) {
				if (node && typeof node == "object" && node.hasOwnProperty('::GRAMMAR::')) {
					return true;
				} else {
					return false;
				}
			}
			function hasChildNodes(node) {
				if (isGrammarNode(node)) { 
					return (Object.keys(current).length > 1);
				} else {
					return (Object.keys(current).length > 0);
				}
			}
			

			function isLastTranscriptToken(tokens,index) {
				return (i === (parts.length -1));
			}
			
			
			/**
			 * GRAMMAR INDEXING FUNCTIONS
			 ***/
		
			/**
			 * Traverse the grammar tree by moving the current pointer to the subtree
			 * matching word or creating a new subtree element for word.
			 * Where the word is the last token in the parts, assign the SpeechifyGrammar instance to 
			 * mark that this is an endpoint in the grammar.
			 * @ return object - tree node after traversal or creation.
			 */	
			function traverseGrammar(parts,current,word,grammar) {
				if (word && typeof word == "string" && word.trim().length>0) {
					// add grammar with this word
					// traverse tree
					if (current.hasOwnProperty(word)) {
						current = current[word];
					
					// create new tree node
					} else {
						current[word] = {};
						current = current[word];
					}
					
				}
				// last token, assign grammar
				if (parts.length == 1) {
					current['::GRAMMAR::']=grammar;
				} 
				return current;
			}
			
			/**
			 * Add a rule to global grammar.
			 * Called recursively with gradually shorter rule and a current 
			 * node that the rest of the rule is added to.
			 * The rule is split by spaces and each token is another level 
			 * of depth added to the grammar tree.
			 * [] are used to indicate optional in a rule
			 * [aaa|bbb|ccc]  vertical bar | is used to provide OR cases
			 *  
			 * @param rule - string containing remaining rule definition
			 * @param grammar - tree of all grammars added 
			 * @param current - current node in grammar that the remaining rule parts are added to.
			 */
			function addGrammarRecursive(rule,grammar,current) {
				var parts=rule.split(' ');
				var word = parts[0];
				// RECURSIVE CASES
				// DEAL WITH SQUARE BRACKETS (OPTIONAL)
				// is this and option token with no spaces
				//console.log(['AGR',rule,parts,word,grammar]);
				// SQUARE BRACKETS ONE TOKEN
				if (word.slice(0,1) == "[" && word.slice(-1) == "]" ) {
					// split on vertical bar for options
					wordOptions = word.slice(1,-1).split("|");
					for (  i = 0; i < wordOptions.length; i++) {
						// extra head to tree iteration with this wordOption
						var current2 = current;
						current2 = traverseGrammar(parts,current2,wordOptions[i],grammar);
						addGrammarRecursive( parts.slice(1).join(" "),grammar,current2);
					}
					// and extra head without this token
					var current3 = current;
					current3 = traverseGrammar(parts,current3,wordOptions[i],grammar);
					addGrammarRecursive(parts.slice(1).join(" "),grammar,current3);
				// SQUARE BRACKETS OVER MANY TOKENS
				// where there are spaces inside the brackets, collate the parts
				} else if (word.slice(0,1) == "[") { 
					// iterate tokens looking for close
					var i = 0
					// seek end bracket
					for (  i = 0; i < parts.length && parts[i].slice(-1) != "]"; i++) {
						
					}
					var current2 = current;
					var inside = parts.slice(0,i+1);
					var after = parts.slice(i+1);
					if (i == parts.length) throw new SpeechifyGrammarException('Missing end bracket ]') ;
					var wordOptions = inside.join(" ").slice(1,-1).split("|");
					// split on vertical bar for options
					for (  i = 0; i < wordOptions.length; i++) {
						// check for multi token (space)
						if (wordOptions[i].split(' ').length >1) {
							addGrammarRecursive(wordOptions[i] + ' ' + after.join(" "),grammar,current2);
						} else {
						// extra head to tree iteration with this wordOption
							var current3 = current;
							current3 = traverseGrammar(parts,current3,wordOptions[i],grammar);
							addGrammarRecursive( after.join(" "),grammar,current3);
						}
					}
					// and extra head without this token
					var current3 = current;
					addGrammarRecursive(after.join(" "),grammar,current3);
				// DEAL WITH ROUND BRACKETS (RECURSIVELY)
				// is this and option token with no spaces
				// ROUND BRACKETS SINGLE TOKEN
				} else if (word.slice(0,1) == "(" && word.slice(-1) == ")" ) {
					// split on vertical bar for options
					wordOptions = word.slice(1,-1).split("|");
					for (  i = 0; i < wordOptions.length; i++) {
						// extra head to tree iteration with this wordOption
						var current2 = current;
						current2 = traverseGrammar(parts,current2,wordOptions[i],grammar);
						addGrammarRecursive( parts.slice(1).join(" "),grammar,current2);
					}
				// where there are spaces inside the brackets, collate the parts
				// ROUND BRACKETS MULTI TOKEN
				} else if (word.indexOf("(") !== -1) { 
					// extract text until the matching close bracket
					var i = 0;
					var depth = 0;
					var start=true;
					var combined = parts.join(" ");
					// collate everything inside bracketed groups
					for (  i = 0; (i < combined.length && depth > 0) || start  ; i++) {
						start = false;
						// allow for nested brackets. inner bracket must be space seperated ie ( (joe|fred) (ate|slept) now)
						if (combined.charAt(i) == "("){
							depth++;
						}
						if (combined.charAt(i) == ")") {
							depth--;
						}
					}
					// slice it up based on the last matching depth bracket
					var current2 = current;
					var inside = combined.slice(0,i+1).trim().split(" ");
					var after = combined.slice(i+1).trim().split(" ");
					if (i == parts.length) throw new SpeechifyGrammarException('Missing end bracket ) - '+parts.join(" ")) ;
					
					// add grammar for stuff inside brackets (allowing for further inner brackets)
					var insideString = inside.join(" ").trim().slice(1,-1);
					var orParts =[];
					orParts[0]='';
					var orPartsIndex = 0;
					var depth = 0;
					// initialise for text append
					// iterate characters collating by | divisions 
					// dont start new collation inside brackets ()
					for (  var i = 0; i < insideString.length; i++) {
						// allow for nested brackets 
						if (insideString.charAt(i) == "(") {
							depth++;
							orParts[orPartsIndex] += insideString.charAt(i);
						} else if (insideString.charAt(i) == ")") {
							depth--;
							orParts[orPartsIndex] += insideString.charAt(i);
						} else if (depth == 0 && insideString.charAt(i) == "|") {
							orPartsIndex++;
							orParts[orPartsIndex]='';
						} else {
							orParts[orPartsIndex] += insideString.charAt(i);
						}
					}
					for (  i = 0; i < orParts.length; i++) {
						addGrammarRecursive([orParts[i],after.join(" ")].join(" "),grammar,current2);
					}
				// NO GROUPING BUT POSSIBLY SINGLE TOKEN OPTIONS
				} else {
					// split on vertical bar for options
					var wordOptions =[];
					wordOptions[0]='';
					var wordOptionsIndex = 0;
					var depth = 0;
					// initialise for text append
					// iterate characters collating by | divisions 
					// dont start new collation inside brackets ()
					for (  var i = 0; i < word.length; i++) {
						// allow for nested brackets 
						if (word.charAt(i) == "(" ) {
							depth++;
							wordOptions[wordOptionsIndex] += word.charAt(i);
						} else if (word.charAt(i) == ")" ) {
							depth--;
							wordOptions[wordOptionsIndex] += word.charAt(i);
						} else if (depth == 0 && word.charAt(i) == "|") {
							wordOptionsIndex++;
							wordOptions[wordOptionsIndex]='';
						} else {
							wordOptions[wordOptionsIndex] += word.charAt(i);
						}
					}
					// add grammar for each wordOption
					for (  i = 0; i < wordOptions.length; i++) {
						// extra head to tree iteration with this wordOption
						var current2 = current;
						current2 = traverseGrammar(parts,current2,wordOptions[i],grammar);
						if (parts.length>1) {
							addGrammarRecursive( parts.slice(1).join(" "),grammar,current2);
						}
					}
				}
				
			}
			
			/*******************
			 * Index the provided grammars by word as a tree
			 * into the variable activeGrammars
			 ******************/
			function addGrammars(grammars,activeGrammars)  {
				// first extract all variable grammars
				console.log(['ADD GRAMMARS',grammars,activeGrammars]);
				$.each(grammars,function(grammarKey,grammar) {
					$.each(grammar.texts,function(ruleKey,rule) {
						var found= true;
						var breakOut = 0;
						var lastVarStart = 0;
						while (found && breakOut < 5) {
							breakOut++;
							var thisRule = grammars[grammarKey].texts[ruleKey];
							var varStart = thisRule.indexOf("$",lastVarStart + 1);
							lastVarStart = varStart;
							var ruleStart = thisRule.indexOf("{");
							var ruleEnd = thisRule.indexOf("}");
							var cleanedRule = thisRule.slice(0,ruleStart) + thisRule.slice(ruleEnd + 1);
							var varName = thisRule.slice(varStart,ruleStart);
							var varRule = thisRule.slice(ruleStart + 1, ruleEnd );
							//console.log(['EG',thisRule,varStart,ruleStart,ruleEnd,cleanedRule,varName,varRule]);
							if (ruleStart !== -1 && ruleEnd !== -1) {
								// update the rule
								grammars[grammarKey].texts[ruleKey] = cleanedRule;
								// save the grammar
								variableGrammars[varName]={};
								var grammar = new SpeechifyGrammar(rule,function() {});  // empty callback to pass through variable  //console.log(['variable grammar ',varName,varRule]); 
								addGrammarRecursive(varRule,grammar,variableGrammars[varName]);
							} else {
								found = false;
							}
						}
						//if () throw new SpeechifyGrammarException('balh');
					});
				});
				// now map grammars into a tree
				$.each(grammars,function(grammarKey,grammar) {
					$.each(grammar.texts,function(ruleKey,rule) {
						// TODO COnST replacements for common features eg __DATE__, __COLOR__
						addGrammarRecursive(rule,grammar,activeGrammars);
					});
				});
			} 

			/**
			 * LOOKUP FUNCTIONS
			 ***/
		
			/**
			 * Recursively traverse the active grammars tree using transcript tokens.
			 * Allow for variables and optional tokens
			 */
			function searchForGrammar(transcript,activeGrammars,variables,partialMatchCallback,successCallback) {
				console.log(['searchForGrammar',transcript,activeGrammars]);
				if (activeGrammars != null && transcript && transcript.length > 0)  {
					console.log(['REALLY searchForGrammar']);
					
					var parts = transcript.trim().split(" ");
					var current = activeGrammars;
					var done = false;
					var word = parts[0];
					// if there is an exact match for next transcript token
					if (activeGrammars.hasOwnProperty(word)) {
						// first recurse (deepest first)
						searchForGrammar(parts.slice(1).join(" "),activeGrammars[word],variables,partialMatchCallback,successCallback);
						// no match deeper in the tree then check if there is a match here
						if (isGrammarNode(activeGrammars[word]) && parts.length < 2) {
							successCallback(activeGrammars[word]['::GRAMMAR::'],variables);
						}
					}
					
					// otherwise are there any variables to try at this branch in the tree
					if (hasVariable(current)) {
						//console.log(['possible variable match',parts.join(" "),activeGrammars]);
						var currentVariables = getVariables(current);
						// iterate variables
						for (var theVar in currentVariables) {
							var currentVar=currentVariables[theVar];
							// iterate end slice of the transcript
							var theRest = parts.slice(1);
							// if variable has subgrammar 
							// assume the transcript is a reasonable length, split transcript by space and iterate sub head arrays
							// where success, call remaining transcript with remaining grammar in this scope
							if (variableGrammars.hasOwnProperty(currentVar)) {
								//console.log(['complex variable match']);
								var breakout = false;
								for (var i =0; i<= theRest.length && !breakout; i++) {
									var transcriptSlice = word + " " + theRest.slice(0,(theRest.length - i )).join(" ").trim();
									searchForGrammar(transcriptSlice,variableGrammars[currentVar],variables,partialMatchCallback,
										// success,found match on variable grammar with slice
										function (grammar,variables) { 
											// save variable
											//variables[currentVar] = transcriptSlice; 
											// try for match on remainder of transcript 
											var remainder = theRest.slice(theRest.length - i ).join(" ");
											console.log(['variable match ',currentVar,transcriptSlice,'REM',remainder]);
											searchForGrammar(remainder,current[currentVar],variables,partialMatchCallback,
												function (grammar,variables) { 
													variables[currentVar] = transcriptSlice.trim(); // parts.slice(0,1).join(" "); 
													//console.log(['SETVAR VAR',currentVar,transcriptSlice.trim()]);
													//console.log(['grammar match ',currentVar,transcriptSlice,'REM',remainder]);
													successCallback(grammar,variables); 
												} 
											);
										} 
									);
								}
							// simple variable, capture text of a success match for variable
							// try gradually larger slices of the transcript searching for a match
							} else {
								//console.log(['simple variable match',parts.join(" "),activeGrammars]);
								//for (var i = 0; i < theRest.length; i++) {
									//console.log(['variable try sub grammar',i,theRest.slice(0,i).join(" ")]);
									searchForGrammar(theRest.join(" "),current[currentVar],variables,partialMatchCallback,function (grammar,variables) { variables[currentVar] = word; console.log(['SETVAR PLAIN',currentVar,word]); successCallback(grammar,variables); } );
								//}
								
							}	
							// if  nothing more specific found, is the variable a grammar node ?
							if (isGrammarNode(current[currentVar])) {
								variables[currentVar]=parts.join(' ');
								//console.log(['SETVAR GRAMMAR',currentVar,word]);
								successCallback(current[currentVar]['::GRAMMAR::'],variables);
							}
							// end if
						}
					}
				}
			}
			/**
			 * Search the activeGrammars tree for the transcript
			 * Recursively call searchForGrammar on potentially matching 
			 * subbranches of the tree
			 * Iteration is in order of precedence, deepest first.
			 * If a grammar match is found, immediately exit all recursion 
			 * and call the grammar.callback function with the grammar and any collected variables.
			 * Where a grammar partially matches the transcript ...
			 * When a grammar 
			 * @return null
			 * @param transcript String transcript of spoken voice 
			 * @param activeGrammars object Grammar tree
			 */
			function processTranscript(transcript,activeGrammars) {
				console.log('PROCESS TRANSCRIPT');
				// clean numbers from transcript
				transcript = transcript.trim().toLowerCase();
				var clean = false;
				while (!clean) {
					// replace digits with text version
					// TODO deal with multi digit numbers
					if (transcript.indexOf('0')!=-1 || transcript.indexOf('1')!=-1 || transcript.indexOf('2')!=-1 || transcript.indexOf('3')!=-1 || transcript.indexOf('4')!=-1 || transcript.indexOf('5')!=-1 || transcript.indexOf('6')!=-1 || transcript.indexOf('7')!=-1 || transcript.indexOf('8')!=-1 || transcript.indexOf('9')!=-1) {
						transcript = transcript.replace("0","zero").replace("1","one").replace("2","two").replace("3","three").replace("4","four").replace("5","five").replace("6","six").replace("7","seven").replace("8","eight").replace("9","nine")
					} else {
						clean = true;
					}
				}
				// require parameter values
				if (transcript && typeof activeGrammars == "object"  && Object.keys(activeGrammars).length > 0) {
					var variables = {};
					var partials = []
					// start recursive seek grammar
					try {
						console.log(['start searchForGrammar ',transcript,activeGrammars,variables]);
						searchForGrammar(
							transcript,
							activeGrammars,
							variables,
							function(a,b) {
								console.log(['PARTIAL',a,b]);
							},
							function (grammar,variables) {
								//console.log(['SUCCESS pre',grammar,variables]);
								// abuse exceptions as break out from any recursive depth
								throw new SpeechifySuccessException(grammar,variables);
							}
						);
						// if we make it this far, there were no matches anywhere
						console.log(['FAIL']);
						var notifyMessage = "No matching command. <br/><br/>I heard <b>" + transcript + '</b>';
						// TODO partial matches feedback
						//if (partials.length > 0) {
							//notifyMessage += "<br/><br/>Did you mean -<br/>";
						//}
						//for ( var i = 0; i < partials.length; i++) {
							//notifyMessage += "<br/>" + partials[i];
						//}
						notifyMessage += "<br/><br/>For a full list try 'What can I say'<br/>";
						jQuery.fn.speechify.notify(notifyMessage);
					} catch (e) {
						if (e instanceof SpeechifySuccessException) {
							console.log(['SUCCESS',e.grammar,e.variables]);
							e.grammar.callback([e.grammar,e.variables]);
							return true;
						} else {
							console.log(['GENERAL ERROR',e]);
						}
					}
				}
				return false;
			}


			//function bindTextEntries(pluginDOM) {
					//$('input[type=text],input[type=search]',pluginDOM).on('click.speechifytext',function() {
					//$(this).unbind('blur.speechifytext');
					//$(this).bind('blur.speechifytext',function() {
						////console.log('stop text entry');
					//});
					////console.log('start text entry');
					//startRecognising();
				//});
				//$('textarea',pluginDOM).on('mouseup.speechifytextarea',function() {
					//$(this).unbind('blur.speechifytextarea');
					//$(this).bind('blur.speechifytextarea',function() {
						////console.log('stop textarea entry');
					//});
					////console.log('start textarea entry');
					//startRecognising();
				//});
				//$('[contenteditable=true]',pluginDOM).on('focus',function() {
					//$(this).unbind('blur.speechifycontenteditable');
					//$(this).bind('blur.speechifycontenteditable',function() {
						////console.log('stop contenteditable entry');
					//});
					////console.log('start contenteditable entry');
					//startRecognising();
				//});
			//}
			
			function startRecognising() {
				console.log('start',restartCount);
				handlerStarted = true;
				recognising = true;	
				activateRecognising();
				//UIStarting();
				// bind voice editing for text entries
				//bindTextEntries(pluginDOM);
			}
			
			function activateRecognising() {
				console.log('activate',restartCount,options);
				//if (speechRecognitionHandler != null) speechRecognitionHandler.stop();
				// if we're already listening, just restart the speech handler
				var disableTimeout = Boolean(options.neverStopListening) ;
				var disablePause =  Boolean(options.neverPauseListening) ;
				// don't auto turn off recognition on android (annoying for cardboard users)
				//var isAndroid = /Android/i.test(navigator.userAgent);
			
				restartCount++;
				if (!disablePause && recognising && restartCount >options.maxRestartBeforePause) {
					pauseRecognising();
				} else if (!disableTimeout && restartCount > options.maxRestartBeforeStop) {
					stopRecognising();
				} else {
					// kick the recognition
					if (handlerStarted) {
						try {
							speechRecognitionHandler.start();
						} catch (e) {
							//console.log(e);
						}	
					}
				}
			}

			function pauseRecognising() {
				restartCount = 0;
				//console.log('pause recog');
				recognising = false;
				handlerStarted = true;
				activateRecognising();
				UIPause();	
				//}
			}

			function stopRecognising() {
				//console.log('STOP');
				if (options.neverStopListening == true) {
					jQuery.fn.speechify.notify('Cannot stop listening');
					return;
				}
				restartCount = 0;
				methods.clearAllOverlays();
				recognising=false;
				handlerStarted=false;
				if (speechRecognitionHandler != null) speechRecognitionHandler.stop();
				UIStop();
			}
			
			function UIInit() {
				//console.log('UIINIT');
				// update and rebind microphone button
				var status=$('#speechify-status');
				if (status && status.length>0)  {
				} else {
					// create notify DOM
					$(pluginDOM).append('<div id="speechify-status" ><span class="microphone" ><img src="'+$.fn.speechify.relPath+'images/microphonepause.png " /></span></div>');
					$('#speechify-status').attr('style','position: fixed; top: 20px; right: 20px;');
				}
				UIStarting();
			}
			
			function UIStarting() {
				//console.log('UIstarting');
				$('#speechify-status .microphone').attr({'class':'microphone microphone-starting'});
				
				$('#speechify-status .microphone img').attr({'alt':'starting','src':$.fn.speechify.relPath+'images/microphonepause.png'});
				$('#speechify-status').unbind('click.speechifystart').bind('click.speechifystart',function() {stopRecognising();});
			}
			
			function UIWaiting() {
				//console.log('UIwaiting');
				if ($('#speechify-status .microphone-on').length > 0)  {
					$('#speechify-status .microphone').attr({'class':'microphone microphone-waiting'});
					
					$('#speechify-status .microphone img').attr({'alt':'waiting','src':$.fn.speechify.relPath+'images/microphonepause.png'});
					$('#speechify-status').unbind('click.speechifystart').bind('click.speechifystart',function() {stopRecognising();});
				}
			}
			
			
			function UIPause() {
				// update UI
				//console.log('UIpaus');
				
				// update and rebind microphone button to display as paused
				$('#speechify-status .microphone').attr({'class':'microphone microphone-pause'});
				
				$('#speechify-status .microphone img').attr({'alt':'pause','src':$.fn.speechify.relPath+'images/microphonepause.png'});
				
				$('#speechify-status').unbind('click.speechifystart').bind('click.speechifystart',function() {startRecognising();});
			}

			function UIStart() {
				//console.log('UIstart');
				
				$('#speechify-status .microphone').attr({'class':'microphone microphone-on'});
				
				$('#speechify-status .microphone img').attr({'alt':'on','src':$.fn.speechify.relPath+'images/microphone.png'});
				$('#speechify-status .microphone img').css('border','2px solid red');
				
				if ($('#speechify-status .speechifymessages').length == 0) {
				  // jQuery.fn.speechify.notify('Start/Stop/Pause Listening or click the microphone.</div><div class="message" >Try <b>what can I say</b>',0);
				}	
				$('#speechify-status').unbind('click.speechifystart').bind('click.speechifystart',function() {stopRecognising();});
				
			}
			
			function UIStop() {
				//console.log('UIstop');
					// update and rebind microphone button to display as stopped
					$('#speechify-status .microphone').attr({'class':'microphone microphone-off'});
					$('#speechify-status .microphone img').attr({'alt' :'off','src':$.fn.speechify.relPath+'images/microphonepause.png'});
					$('#speechify-status .speechifymessages').remove();
					$('#speechify-status').unbind('click.speechifystart').bind('click.speechifystart',function() {startRecognising();});
				
			}
			
			function joinThreeStrings(a,b,c) {
				var res=[];
				if (a && a.length>0) res.push(a);
				if (b && b.length>0) res.push(b);
				if (c && c.length>0) res.push(c);
				return res.join(' ');
			}
			
			function getInputSelection(el) {
				if (el) {
					var start = 0, end = 0, normalizedValue, range,
					textInputRange, len, endRange;

					if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
						start = el.selectionStart;
						end = el.selectionEnd;
					} else {
						range = document.selection.createRange();

						if (range && range.parentElement() == el) {
							len = el.value.length;
							normalizedValue = el.value.replace(/\r\n/g, "\n");

							// Create a working TextRange that lives only in the input
							textInputRange = el.createTextRange();
							textInputRange.moveToBookmark(range.getBookmark());

							// Check if the start and end of the selection are at the very end
							// of the input, since moveStart/moveEnd doesn't return what we want
							// in those cases
							endRange = el.createTextRange();
							endRange.collapse(false);

							if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
								start = end = len;
							} else {
								start = -textInputRange.moveStart("character", -len);
								start += normalizedValue.slice(0, start).split("\n").length - 1;

								if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
									end = len;
								} else {
									end = -textInputRange.moveEnd("character", -len);
									end += normalizedValue.slice(0, end).split("\n").length - 1;
								}
							}
						}
					}

					return {
						start: start,
						end: end
					};
				}
			}
			
			function soundex(s) {
				var a = s.toLowerCase().split(''),
				f = a.shift(),
				r = '',
				codes = {
					a: '', e: '', i: '', o: '', u: '',
					b: 1, f: 1, p: 1, v: 1,
					c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
					d: 3, t: 3,
					l: 4,
					m: 5, n: 5,
					r: 6
					};
				r = f +a.map(function (v, i, a) { return codes[v] })
				.filter(function (v, i, a) {
				return ((i === 0) ? v !== codes[f] : v !== a[i - 1]);
				})
				.join('');

				return (r + '000').slice(0, 4).toUpperCase();
			};

	// END PRIVATE METHODS
	
	// PUBLIC METHODS

	var variableGrammars = {};
	var activeGrammars = {};
	var overlayGrammarsData={};
	var overlayGrammarsStack=[];
	
	var methods={
		ask: function(question,grammarTree,modalGrammar) {
			// load overlay/override grammar
			var grammars=[];
			for (i in grammarTree) {
				grammars.push(new SpeechifyGrammar(grammarTree[i][0],grammarTree[i][1]));
			}
			//console.log(['PUSH OVERLAY',,overlayGrammarsStack,overlayGrammarsData,grammarTree,modalGrammar]);
			var overlayGrammars = {};
			addGrammars(grammars,overlayGrammars);
			overlayGrammarsStack.push(overlayGrammars);
			overlayGrammarsData[overlayGrammarsStack.length - 1] = {'modalGrammar': modalGrammar}; 
			//console.log(['PUSH OVERLAY REALLY DONE',overlayGrammarsStack,overlayGrammarsData]);
			jQuery.fn.speechify.notify(question,-1);
		},
		/* Require the key variable in variables to be non empty 
		 * or trigger a request for the value with an override vocabulary.
		*/
		requireVariable: function (variable,question,variables,successCallback,failCallback) {
			//console.log(['REQUIRE VAR',variable,question,variables]);
			if (variables.hasOwnProperty(variable) && variables[variable].length>0) {
				//console.log(['REQUIRE VAR ALREADY OK']);
				//methods.clearOverlay();
				successCallback(variables[variable]);
			} else {
				//console.log(['REQUIRE VAR ASK']);
				methods.ask(
					question,
					[
					[['$value'],function(parameters) {
						var innerVariables=parameters[1];
						//console.log(['REQUIRE VAR ASK CALLBACK',innerVariables]);
						if (innerVariables.hasOwnProperty('$value') && innerVariables['$value'].length > 0) {
							//console.log(['REQUIRE VAR save',innerVariables]);
							methods.clearOverlay();
							successCallback(innerVariables['$value'],function () {methods.clearOverlay();});
							
						} else {
							methods.clearOverlay();
							failCallback();
						}
					}],
					[['cancel'],function() {
						methods.clearOverlay();
						failCallback();
					}]
					],
					true
				);
			}
		},
		confirm: function (question,successCallback) {
			methods.ask(
				question,
				[[['$yesno{yes|no|ok|cancel}'],function(parameters) {
							var variables = parameters[1];
							if (variables.hasOwnProperty('$yesno') && (variables['$yesno']=="yes" || variables['$yesno']=="ok")) {
								successCallback();
								methods.clearOverlay();
							} else if (variables.hasOwnProperty('$yesno') && (variables['$yesno']=="no" || variables['$yesno']=="cancel")) {
								methods.clearOverlay();
								jQuery.fn.speechify.notify('Cancelled.');
							} else {
								jQuery.fn.speechify.notify('<b>I could not understand you.</b> <br>' + question,0);
							}
						}
					]
				]
			,true);
		},
		dump: function() {
			console.log(['DUMP ACTIVE GRAMMAR']);
			console.log(activeGrammars);
			console.log(['DUMP OVERLAY']);
			console.log(overlayGrammarsStack);
			console.log(overlayGrammarsData);
		},
		
		clearOverlay: function() {
			//console.log('CLEAR OVERLAY',overlayGrammarsStack.length,overlayGrammarsStack);
			delete overlayGrammarsData[overlayGrammarsStack.length - 1];
			overlayGrammarsStack.pop();
		},
		clearAllOverlays: function() {
			//console.log('CLEAR ALL OVERLAY');
			overlayGrammarsStack = [];
			overlayGrammarsData = {};
		},

		runTests : function(grammarStrings,testSuite) {
			var logged = '';
			var clog = function(toLog) {
				console.log(toLog);
				logged += JSON.stringify(toLog) + "\n";
			}	
			var logged2 = '';
			var clog2 = function(toLog) {
				console.log(toLog);
				logged2 += JSON.stringify(toLog) + "\n";
			}//console.log=function() {}
			var activeGrammars = {};
			clog('run tests now');
			testCallbackResult='';
			var testCallback = function(res) {
				grammar = res[0];
				variables= res[1];
				console.log(['TEST callback',grammar,variables]);
				testCallbackResult={key: grammar.texts[0], variables:variables};
			}
			var testGrammars=[];
			for (i in grammarStrings) {
				testGrammars.push(new SpeechifyGrammar([grammarStrings[i]],testCallback));
			}
			clog(['run tests']);
			addGrammars(testGrammars,activeGrammars);
			clog(['run tests ACTIVE GRAMMARS ',activeGrammars,'VARIABLE GRAMMARS',variableGrammars]);
			for (i in testSuite) {
				//console.log(['exec test',testSuite[i]]);
				testCallbackResult='::FAIL::';
				processTranscript(testSuite[i]['transcript'],activeGrammars);
				// clog/clog2 to log fails first
				if (JSON.stringify(testCallbackResult) == JSON.stringify(testSuite[i]['result'])) {
					// PASS
					clog2(['PASS '+i+' Transcript',testSuite[i]['transcript']]);
					//clog2(['PASS Expect',JSON.stringify(testSuite[i]['result'])]);
					clog2(['PASS '+i+' Got',JSON.stringify(testCallbackResult)]);
					clog2('');
				} else {
					// FAIL
					clog(['FAIL '+i+' Transcript',testSuite[i]['transcript']]);
					clog(['FAIL '+i+' Expect',JSON.stringify(testSuite[i]['result'])]);
					clog(['FAIL '+i+' Got',JSON.stringify(testCallbackResult)]);
					clog2('');
				}
			}
			document.write('<pre>'+logged+"\n"+logged2+"</pre>");
		},
		init : function(initOptions) {
			pluginDOM=this;
			options=$.extend({forceHttps:false,'relPath':''},initOptions);
			//console.log('INIT');
			//console.log(options);
			if (options.forceHttps) {
				if (window.location.protocol!='https:') window.location='https://'+window.location.hostname+window.location.pathname; 
			} 
			if (!Boolean(options.neverPauseListening) && !Boolean(options.maxRestartBeforePause)) {
				options.maxRestartBeforePause = 10;
			}
			if (!Boolean(options.neverStopListening) && !Boolean(options.maxRestartBeforeStop)) {
				options.maxRestartBeforeStop = 30;
				
			}
			
			var grammars=$.extend({},options.grammars);
			// shortcut initialise grammar
			// append grammarTree array to grammar as SpeechGrammar objects
			if (options.grammarTree != null) {
				var grammars=[];
				for (i in options.grammarTree) {
					grammars.push(new SpeechifyGrammar(options.grammarTree[i][0],options.grammarTree[i][1]));
				}
			}
			
			addGrammars(grammars,activeGrammars);
			//console.log(['GRAMMARS',grammars]);
			//console.log(['COLLATED',activeGrammars]);
			UIInit();
			 jQuery.fn.speechify.notify('Start/Stop/Pause Listening or click the microphone.</div><div class="message" >Try <b>what can I say</b>',0);
				
			// PLUGIN INIT STARTS HERE
			
			try {
				speechRecognitionHandler.lang='en-AU';
				speechRecognitionHandler.continuous = false;
				speechRecognitionHandler.maxAlternatives = 5;
				//console.log(['init with handler',speechRecognitionHandler]);
				
				//UIStop();
				
				speechRecognitionHandler.onstart = function() {
					//console.log('onstart');
					if (recognising) {
						UIStarting();
					}
				}
				speechRecognitionHandler.onend = function() {
					//console.log('onend');
				}
				speechRecognitionHandler.onaudiostart = function() {
					//console.log('audiostart');
					if (recognising) {	
						UIStart();
						$('#speechify-status .microphone img').css('border','2px solid green');
					}
					
				}
				speechRecognitionHandler.onaudioend = function() {
					//console.log('audioend');
					if (recognising) {
						UIWaiting();
						$('#speechify-status .microphone img').css('border','2px solid red');
					}
				}
				
				speechRecognitionHandler.onsoundstart = function() {$('#speechify-status .microphone img').css('border','2px solid blue');}
				speechRecognitionHandler.onsoundend = function() {$('#speechify-status .microphone img').css('border','2px solid orange');}
				speechRecognitionHandler.onspeechstart = function() {
					//console.log('onspeechstart');
				}
				speechRecognitionHandler.onspeechend = function() {
					//console.log('onspeechend');
				}
				
				speechRecognitionHandler.onresult = function(event){
					restartCount = 0;
					//console.log(['onresult',event,event.results]);
					for (var i = event.resultIndex; i < event.results.length; ++i) {
						if (event.results[i].isFinal) {
							transcript = $.trim(event.results[i][0].transcript);
							console.log(['transcript',transcript]);
							// what command
							if (transcript=="start listening" || transcript=="wake up") {
								UIStarting();
								startRecognising();
							}  else if (transcript=="pause listening" || transcript=="go to sleep") {
								pauseRecognising();
							} else if (transcript=="stop listening") {
								stopRecognising();
							} else if (recognising) {
								// HANDLE EDITABLE TEXT FIELDS
								if ($('input[type=text]:focus').length>0) {
									$('input[type=text]:focus').val(transcript)
								} else if ($('textarea:focus').length>0) {
									var sel = getInputSelection($('textarea:focus')[0]);
									var val = $($('textarea:focus')).val();
									//$(captureTarget).data('oldval',val);
									$($('textarea:focus')).val(joinThreeStrings($.trim(val.slice(0, sel.start)),transcript,$.trim(val.slice(sel.end))));
								} else if ($('*[contenteditable=true]:focus').length>0) {
									function replaceSelectedText(replacementText) {
										var sel, range;
										if (window.getSelection) {
											sel = window.getSelection();
											if (sel.rangeCount) {
												range = sel.getRangeAt(0);
												range.deleteContents();
												range.insertNode(document.createTextNode(replacementText+' '));
											}
										} else if (document.selection && document.selection.createRange) {
											range = document.selection.createRange();
											range.text = replacementText+' ';
										}
									}
									replaceSelectedText(transcript);
								// START MAIN DECISION MAKING HERE
								} else {
									// process overlays first
									var success = false;
									//console.log('PROCESS OVERLAY GRAMMARS');
									speechify.dump();
									for (var j = overlayGrammarsStack.length - 1 ;j >= 0 ;j--) {
										//console.log(['PROCESS OVERLAY GRAMMAR',transcript,overlayGrammarsStack[j]]);
										var result = processTranscript(transcript,overlayGrammarsStack[j]);
										if (result) {
											success = true;
											//console.log('BREAK ON SUCCESS');
											break;
										}
										// bail out if this was a blocking grammar
										if (overlayGrammarsData[j].modalGrammar) {
											//console.log('BREAK ON MODAL');
											break;
										}
									}
									if (!success) {
										//console.log('PROCESS MAIN GRAMMAR');
										processTranscript(transcript,activeGrammars);
									}
								}
								console.log('COMMAND:'+transcript);
							} else {
								console.log('IGNORE while paused:'+transcript);
							}
						}
					}
				};
				
				speechRecognitionHandler.onstart = function(){
					//console.log('start speech recognition');
				};
				speechRecognitionHandler.onerror = function(e){
					switch (e.error) {
						case 'network':
						case 'no-speech': 
							activateRecognising();
							break;
						case 'not-allowed':
						case 'service-not-allowed':
							stopRecognising();
							break;
						default: 
							console.log(['UNKNOWN ERROR', e]);
					}
					console.log(['ERROR', e]);
				};
				
				// restart recognition on successful end 
				speechRecognitionHandler.onend = function(e){
					activateRecognising();
				};
				//console.log('start recog');
				startRecognising();
			} catch (e) {
//				console.log('EEEK');
				console.log(e.message);
			}
			
			return methods;
		}
	};

	$.fn.speechify = function(method) {
		if ($.isFunction(methods[method])) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if(typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error("Method " +  method + " does not exist on jQuery.fn.pluginTemplate");
		}
	};

	$.fn.speechify.relPath='';

	$.fn.speechify.say=function(text) {
		var msg = new SpeechSynthesisUtterance(text);
		window.speechSynthesis.speak(msg);
	};

	// duration 0 for persistent message
	$.fn.speechify.notify=function(text,duration) {
		if ($("#speechify-status .microphone .speechifymessages").length ==0)  {
			$("#speechify-status .microphone").append("<div class='speechifymessages' ></div>");
		}
		
		console.log(['notify',duration,text]);
		var newMessage=$('<span class="message" >' + text + '</span>');
		// accept >=0 duration or set default
		duration = (duration === 0) ? duration : (Boolean(duration) ? parseInt(duration) : 5000);
		$("#speechify-status .microphone .speechifymessages").html(newMessage);
		$("#speechify-status .microphone .speechifymessages").show();
		if (duration > 0) {
			setTimeout(function() {
				newMessage.hide('slow');
				newMessage.remove();
				if ($("#speechify-status .microphone .speechifymessages .message").length==0) {
					$("#speechify-status .microphone .speechifymessages").remove();
				}
			},duration);
		}
	};
	
	$.fn.speechify.grammarLibrary = {
		'color' : '(Alice Blue|Antique White|Aqua|Aquamarine|Azure|Beige|Bisque|Black|Blanched Almond|Blue|Blue Violet|Brown|Burly Wood|Cadet Blue|Chartreuse|Chocolate|Coral|Cornflower Blue|Corn silk|Crimson|Cyan|Dark Blue|Dark Cyan|Dark Golden Rod|Dark Gray|Dark Grey|Dark Green|Dark Khaki|Dark Magenta|Dark Olive Green|Dark Orange|Dark Orchid|Dark Red|Dark Salmon|Dark Sea Green|Dark Slate Blue|Dark Slate Gray|Dark Slate Grey|Dark Turquoise|Dark Violet|Deep Pink|Deep Sky Blue|Dim Gray|Dim Grey|Dodger Blue|Fire Brick|Floral White|Forest Green|Fuchsia|Gainsboro|GhostWhite|Gold|Golden Rod|Gray|Grey|Green|Green Yellow|Honey Dew|Hot Pink|Indian Red|Indigo|Ivory|Khaki|Lavender|Lavender Blush|Lawn Green|Lemon Chiffon|Light Blue|Light Coral|Light Cyan|Light GoldenRod Yellow|Light Gray|Light Grey|Light Green|Light Pink|Light Salmon|Light Sea Green|Light Sky Blue|Light Slate Gray|Light Slate Grey|Light Steel Blue|Light Yellow|Lime|Lime Green|Linen|Magenta|Maroon|Medium Aqua Marine|Medium Blue|Medium Orchid|Medium Purple|Medium Sea Green|Medium Slate Blue|Medium Spring Green|Medium Turquoise|Medium Violet Red|Midnight Blue|Mint Cream|Misty Rose|Moccasin|Navajo White|Navy|Old Lace|Olive|Olive Drab|Orange|Orange Red|Orchid|Pale Golden Rod|Pale Green|Pale Turquoise|Pale Violet Red|Papaya Whip|Peach Puff|Peru|Pink|Plum|Powder Blue|Purple|Rebecca Purple|Red|Rosy Brown|Royal Blue|Saddle Brown|Salmon|Sandy Brown|Sea Green|Sea Shell|Sienna|Silver|Sky Blue|Slate Blue|Slate Gray|Slate Grey|Snow|Spring Green|Steel Blue|Tan|Teal|Thistle|Tomato|Turquoise|Violet|Wheat|White|White Smoke|Yellow|Yellow Green)',
		
		'number' : '(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)',
		// TODO
		'date' : '[$time{$TODO} am|pm] [$day] [$month{()}] [$year]'
		
	}
	

}
speechifyPlugin(jQuery,window,undefined);


export default class Speechify extends Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.speechify();
  }

  componentWillUnmount() {
    this.$el.speechify('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}
