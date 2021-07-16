import React from 'react';
import ReactDOM from 'react-dom';
import { Dropdown } from 'semantic-ui-react'

export class JobSortingByDate extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(event) {
        var data = Object.assign({}, this.props.sortBy);
        // console.log(`JobSortingByDate.handlechange ${data}`);
        const name = event.target.name;
        const value = event.target.value;
        const id = event.target.id;

        // console.log(`JobSortingByDate.handlechange name ${name}`);
        // console.log(`JobSortingByDate.handlechange data[name] ${data[name]}`);
        data[name] = value;
        // console.log(`JobSortingByDate.handlechange data[name] ${data[name]}`);

        var updateData = {
            target: { type: event.target.type, id: event.target.id, name: "sortBy", value: data }
        }
        //debugger;
        //update props here
        this.props.handleChange(updateData);
    }

    render() {
        let selectedSorting = this.props.sortBy.date;        

        return (
            <select className="ui search dropdown" onChange={this.handleChange} name="date" value={selectedSorting}>
                <option value='desc' key='desc'>Newest first</option>
                <option value='ascend' key='ascend'>Oldest first</option>
            </select>
        )
    }
}