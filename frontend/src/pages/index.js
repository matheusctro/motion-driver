import React from 'react';
import { connect } from 'react-redux';
import { PAGES } from '../config';

const PageSwitcher = (props) => (
    <div>
        {PAGES[props.page]}
    </div>
);

const mapStateToProps = (state) => ({
    page: state.general.page;
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(PageSwitcher)