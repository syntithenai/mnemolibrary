/* eslint-disable */ 
import React, { Component } from 'react';
import HelpNavigation from './HelpNavigation';

export default class TermsOfUse extends Component {
    
    render() {
		this.props.analyticsEvent('help - terms of use');
        return  (
        <div className="termsofuse" >
        
            <HelpNavigation setCurrentPage={this.props.setCurrentPage}/>
            <br/>
            <ol>
<li><span style={{fontWeight: "400"}}><strong>Agreement to be bound</strong></span>
<ol>
<li><span style={{fontWeight: "400"}}>By using our service you agree to be bound by the terms of agreement, which may change from time to time</span></li>
</ol>
</li>
<li><span style={{fontWeight: "400"}}><strong>Privacy</strong></span>
<ol>
<li><span style={{fontWeight: "400"}}>Your personal information such as name and email address will not be shared with anybody unless required by law. </span></li>
<li><span style={{fontWeight: "400"}}>We will use your personal information only for the purpose of providing this service, for example by recording activity and performance on this site to provide analytics to users. </span></li>
<li><span style={{fontWeight: "400"}}>We use cookies on this site, which you can reject through your browser settings.</span></li>
</ol>
</li>
<li><span style={{fontWeight: "400"}}><strong> Age limit</strong></span>
<ol>
<li><span style={{fontWeight: "400"}}>Children under the age of 13 may not create an account independent of their parent or guardian</span><span style={{fontWeight: "400"}}></span></li>
</ol>
</li>
<li><span style={{fontWeight: "400"}}><strong>Intellectual property</strong></span>
<ol>
<li><span style={{fontWeight: "400"}}>The content on this site, including that contributed by users, is subject to a Creative Commons Licence (Attribution CC BY Version 4.0 (international licence)) (<a href="http://creativecommons.org.au/learn/licences/">see here</a>). This means that 'whenever a work is copied or redistributed ... the original creator (and any other nominated parties) must be credited and the source linked to.' For the purposes of this site, the attribution must be to <strong>'mnemolibrary.com' </strong>or<strong> 'Mnemo's Library'</strong>.</span></li>
<li><span style={{fontWeight: "400"}}>The software used on this site is open source and subject to GNU General Public License version 3 (<a href="https://opensource.org">see here</a>)</span></li>
</ol>
</li>
<li><span style={{fontWeight: "400"}}> <strong>Third-party content</strong></span>
<ol>
<li><span style={{fontWeight: "400"}}>This site imports content from third parties. This is not an endorsement of this material and we have no responsibility for any loss caused by reliance or access to third-party sites.</span></li>
</ol>
</li>
<li><span style={{fontWeight: "400"}}> <strong>User conduct</strong></span>
<ol>
<li><span style={{fontWeight: "400"}}>You will not engage in conduct or contribute content that belongs to another party or is offensive, obscene, threatening, unlawful, defamatory, vilifying, inducing to violence, harassing, invasive of privacy, or discriminatory, solicitation or spam or private or confidential information or that jeopardises the operations of the site in any way or seek to gain unauthorised access to our servers or misuse the site to cause harm.</span></li>
<li><span style={{fontWeight: "400"}}>We will endeavour to and reserve the right to remove content that breaches these terms as quickly as possible but we accept no liability for any harm suffered by exposure to or reliance on such content.</span></li>
<li><span style={{fontWeight: "400"}}>We may preserve and disclose user content if required to do so by law.</span></li>
</ol>
</li>
<li><span style={{fontWeight: "400"}}> <strong>Termination of Your Account</strong></span>
<ol>
<li><span style={{fontWeight: "400"}}>We may modify, suspend or delete your account and associated user content and block your access to the site if you breach these terms. </span></li>
<li><span style={{fontWeight: "400"}}>You may request that your account be deleted at any time and we will comply in reasonable time.</span></li>
<li><span style={{fontWeight: "400"}}>Termination of your account will not necessarily remove content you have contributed according to the terms in the preceding clause. </span></li>
</ol>
</li>
<li><span style={{fontWeight: "400"}}> <strong>No Representations or Warranties</strong></span>
<ol>
<li><span style={{fontWeight: "400"}}>We do not guarantee that our services will always be available or free from bugs or viruses and the onus is on you to maintain current anti-virus software.</span></li>
<li><span style={{fontWeight: "400"}}>We will endeavor to provide quality content, but make no guarantees to the ongoing quality or quantity of content, including premium content.</span></li>
<li><span style={{fontWeight: "400"}}>We do not guarantee any warranties such as implied warranties of fitness for purpose or that this site will result in any improvement in your learning.</span></li>
<li><span style={{fontWeight: "400"}}>We do not guarantee that the information on this site is accurate or up to date.</span></li>
</ol>
</li>
<li><span style={{fontWeight: "400"}}> <strong>Limitation of Liability</strong></span>
<ol>
<li><span style={{fontWeight: "400"}}>Other than as required by law, we are not liable to you for any damages caused by use of or reliance on this site<br /></span></li>
</ol>
</li>
<li><span style={{fontWeight: "400"}}> <strong>Indemnity</strong></span>
<ol>
<li><span style={{fontWeight: "400"}}>You agree to indemnify us from any loss or liability due to a claim brought by any third party arising from your user content or conduct.</span></li>
</ol>
</li>
<li><span style={{fontWeight: "400"}}> <strong>Dispute resolution etc</strong></span>
<ol>
<li><span style={{fontWeight: "400"}}>These terms and the relationship between us and you are governed by the laws of Australia and subject to the exclusive jurisdiction of Australian courts, with the exception of injunctive relief in any jurisdiction in order to enforce our rights under these terms.</span></li>
<li><span style={{fontWeight: "400"}}>If we fail to exercise or enforce any rights or provision of these terms, this does not constitute a waiver of such rights or provisions.</span></li>
<li><span style={{fontWeight: "400"}}>If any provision of the terms are found by a court of competent jurisdiction to be invalid, the parties nevertheless agree that the court should endeavour to give effect to the parties' intentions as reflected in the provision, and the other provisions of the terms remain in full force and effect.</span></li>
<li><span style={{fontWeight: "400"}}>You agree that these terms represent the entire understanding between us and you and these terms supersede any previous agreements, promises, assurances, warranties, representations and understandings, whether written or oral, between us and you.</span></li>
</ol>
</li>
</ol>
        </div>
)

}


}
