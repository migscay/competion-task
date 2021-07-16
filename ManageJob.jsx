import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { JobSortingByDate } from './JobSortingByDate.jsx';
//import JobFilter  from './JobFilter.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: "",
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
        this.handleChange = this.handleChange.bind(this);
        this.updateSortBy = this.updateSortBy.bind(this);
        this.onChechboxChange = this.onChechboxChange.bind(this);
    };

    handleChange(event) {
        var data = Object.assign({}, this.props.jobDetails);
        
        //required
        const name = event.target.name;
        const value = event.target.value;
        const id = event.target.id;

        if (event.target.type == "checkbox") {
            var subData = data[id];
            if (event.target.checked == true) {
                subData.push(name);
            }
            else if (subData.includes(name)) {
                const index = subData.indexOf(name);
                if (index !== -1) {
                    subData.splice(index, 1);
                }
            }
            data[id] = subData;
        }
        else {
            data[name] = value;
        }

        var updateData = {
            target: { name: "jobDetails", value: data }
        }

        this.props.updateStateData(updateData);
    }

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        //this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )
        
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var link = 'http://mvptalentt.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here
       $.ajax({ 
        url: link,
        headers: {
            'Authorization': 'Bearer ' + cookies,
            'Content-Type': 'application/json'
        },
        type: "GET",
        data: {
            activePage: this.state.activePage, 
            sortbyDate: this.state.sortBy.date,
            showActive: this.state.filter.showActive,
            showClosed: this.state.filter.showClosed,
            showDraft: this.state.filter.showDraft,
            showExpired: this.state.filter.showExpired,
            showUnexpired: this.state.filter.showUnexpired
        },
        contentType: "application/json",
        dataType: "json",
        success: function (res) {
            let employerJobs = null;
            if (res.myJobs) {
                employerJobs = res.myJobs
                console.log("employerJobs", employerJobs)
                this.setState({
                    loadJobs: employerJobs,
                    totalPages: Math.ceil(res.totalCount / 6)
                })
            }
            callback();
            //this.updateWithoutSave(employerData)
        }.bind(this),
        error: function (res) {
            console.log(res.status)
            callback();
        }
        }) 
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    //Task 2 07/12/2021 passed down to JobSortingByDate to update the state.sortBy
    updateSortBy(event) {
        const data = Object.assign({}, this.state)
        //because you are changing the selection of jobs, makes sense that you restarting from page 1
        const activePage = 1;
        data['activePage'] = activePage
        data[event.target.name] = event.target.value
        this.setState({
            sortBy: data 
        })
        this.loadNewData(data); 
    }

    // Change page
    paginate(activePage) {
        const data = Object.assign({}, this.state)
        data['activePage'] = activePage
        this.setState({
            activePage: activePage
        })
        this.loadNewData(data); 
    }
    
    onChechboxChange(dataLabel){
        //because you are changing the selection of jobs, makes sense that you restarting from page 1
        const data = Object.assign({}, this.state);
        const activePage = 1;
        data.filter[dataLabel] = !this.state.filter[dataLabel];
        data['activePage'] = activePage;
        this.setState({
            activePage: activePage,
            filter: data.filter
        });
        this.loadNewData(data); 
    }

    render() {

        const sortOptions = Object.entries(this.state.filter).map((e) => ( { key: e[0], value: e[1] } ));
        
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
               <div className ="ui container">List of Jobs</div>
               <div className ="ui container">
                   <i className="filter icon"></i>
                   Filter:
                    <Dropdown
                        multiple
                        simple
                        item
                        inline
                        text='Choose Filter'
                        options={sortOptions.map((opt)=><Dropdown.Item key={opt.key}><Checkbox  onChange={(event, data)=>this.onChechboxChange(data.label)} label={opt.key} defaultChecked={opt.value}/></Dropdown.Item>)}
                    />
                   <i className="calendar alternate outline icon"></i>
                   Sort by date: 
                   <JobSortingByDate
                        sortBy={this.state.sortBy}
                        handleChange={this.updateSortBy}
                    />
                    <br/><br/>
                    <div className="ui two cards">
                        { this.state.loadJobs.length === 0 ? "No Jobs Found" :
                          this.state.loadJobs.map((employerJob) => (                     
                        <JobSummaryCard employerJob={employerJob}/>
                        ))}
                    </div>
                    <br/>
                    <div className ="ui container">
                        { this.state.loadJobs.length > 0 ? 
                        <Pagination className ="ui justify-content-center"   
                            activePage={this.state.activePage}
                            totalPages={this.state.totalPages}
                            onPageChange={(event, data) => this.paginate(data.activePage)}
                        /> : "" }                  
                    </div>                  
                </div>
            </BodyWrapper>
        )
    }
}