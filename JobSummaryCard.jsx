import React from 'react';
import Cookies from 'js-cookie';
import { Popup,Label,Icon,Button,Grid,Header } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this);
        this.state = {
            expired: false,
            closed: false
        }
    }

    componentDidMount() {
        let expired = moment().isAfter(this.props.employerJob.expiryDate);
        this.setState({
            expired: expired,
            closed: Boolean(this.props.employerJob.status) 
        })
    };

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({ 
        url: 'http://mvptalentt.azurewebsites.net/listing/listing/closeJob',
        headers: {
            'Authorization': 'Bearer ' + cookies,
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(this.props.employerJob.id),
        contentType: "application/json",
        dataType: "json",
        success: function (res) {
            if (res.success) {
                TalentUtil.notification.show("Job closed successfully", "success", null, null);
                this.setState({
                    closed: true
                })
            }
            else {
                TalentUtil.notification.show("Error while closing Job", "error", null, null);
            }
        }.bind(this),
        error: function (res) {
            TalentUtil.notification.show("Error while closing Job", "error", null, null);
            // callback();
        }
        })     
}

    render() {

        if (this.state.closed) {
            return (
                <div className="ui wide card">
                    <div className="content">      
                        <div className="header">      
                            {this.props.employerJob.title}
                        </div>
                        <Label as='a' color='black' ribbon='right'>
                            <Icon name='user'/>{this.props.employerJob.noOfSuggestions}
                        </Label>
                        <br/><br/>
                        <div className="description">
                            {this.props.employerJob.location.city ? this.props.employerJob.location.city + ", " : ""}{this.props.employerJob.location.country}
                        </div>
                        <div className="description">
                            {this.props.employerJob.summary}
                        </div>
                        <div className="extra content">
                            <div className="four buttons">
                                <button type="button" className="ui right floated red button disabled"><i className="dont icon"></i>Closed</button>                               
                                <button type="button" className="right floated ui basic button disabled"><i className="edit icon"></i>Edit</button>
                                <button type="button" className="right floated ui basic button"><i className="copy outline icon"></i>Copy</button>
                                {this.state.expired ? <button type="button" className="ui red button disabled">Expired</button>                                
                                    : '' } 
    
                            </div>
                        </div>
                    </div>
                </div>
    
            )
    
        } else {
            return (
                <div className="ui wide card">
                    <div className="content">      
                        <div className="header">      
                            {this.props.employerJob.title}
                        </div>
                        <Label as='a' color='black' ribbon='right'>
                            <Icon name='user'/>{this.props.employerJob.noOfSuggestions}
                        </Label>
                        <br/><br/>
                        <div className="description">
                            {this.props.employerJob.location.city ? this.props.employerJob.location.city + ", " : ""}{this.props.employerJob.location.country}
                        </div>
                        <div className="description">
                            {this.props.employerJob.summary}
                        </div>
                        <div className="extra content">
                            <div className="four buttons">
                                <Popup trigger={<button type="button" className="ui right floated button"><i className="dont icon"></i>Close</button>} flowing hoverable>
                                    <Grid centered divided columns={2}>
                                        <Grid.Column textAlign='center'>
                                            <Header as='h4'>Closing Job</Header>
                                            <Button onClick={this.selectJob}>Confirm Close Job</Button>
                                        </Grid.Column>
                                    </Grid>
                                </Popup>
                                <a class="right floated ui basic button" href={`/EditJob/${this.props.employerJob.id}`}><i className="edit icon"></i>Edit</a>
                                <button type="button" className="right floated ui basic button"><i className="copy outline icon"></i>Copy</button>
                                {this.state.expired ? <button type="button" className="ui red button disabled">Expired</button>                                
                                    : '' } 
    
                            </div>
                        </div>
                    </div>
                </div>
    
            )
        }
    }
}