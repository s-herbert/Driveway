import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import * as actions from "../actions/actions";

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    color: "#00352F"
  },
  root: {
    display: "flex",
    flexWrap: "wrap"
  }
});

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 100,
      width: 250
    }
  }
};

const fullFields = function() {
  if (
    !//these fields are missing
    (
      this.get("address") &&
      this.get("city") &&
      this.get("state") &&
      this.get("zip") &&
      this.get("start") &&
      this.get("end")
    )
  )
    return false;

  return true;
};

const mapStateToProps = store => ({
  createDrivewayModal: store.driveways.createDrivewayModal,
  submitError: store.driveways.submitError,
  timeError: store.driveways.timeError,
  startTime: store.driveways.startTime,
  endTime: store.driveways.endTime
});

const mapDispatchToProps = dispatch => ({
  //TODO:
  //pan map to new created location
  handleOpen: () => dispatch(actions.openCreateModal()),
  handleClose: () => dispatch(actions.closeCreateModal()),
  handleSubmit: event => {
    event.preventDefault();
    const data = new FormData(event.target);
    const form = document.querySelector("#createDrivewayForm");
    form.classList.remove("shake");
    data.isComplete = fullFields;
    if (data.isComplete()) {
      if (data.hasValidTimes()) {
        return dispatch(actions.createDriveway(data));
      } else {
        return dispatch(actions.errorEndBeforeStart());
      }
    } else {
      form.classList.add("shake");
      return dispatch(actions.errorIncomplete());
    }
  },
  handleStartChange: event =>
    dispatch(actions.setCreateStart(event.target.value)),
  handleEndChange: event => dispatch(actions.setCreateEnd(event.target.value))
});

class CreateDriveway extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const style = {
      form: {
        height: "400px",
        overflow: "scroll"
      },
      select: {
        width: 200,
        height: 30,
        margin: "10px"
      },
      text: {
        width: 200,
        height: 30,
        margin: "10px"
      },
      pictureUpload: {
        margin: "20px"
      }
    };
    const { classes } = this.props;
    let hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(
        <MenuItem key={i} value={i}>
          {String(i)}
        </MenuItem>
      );
    }

    return (
      <div className={classes.root}>
        <Button variant="contained" onClick={this.props.handleOpen}>
          Create Driveway!
        </Button>
        <Dialog
          open={this.props.createDrivewayModal}
          onClose={this.props.handleClose}
          id="createDrivewayForm"
          className="animated"
        >
          <DialogTitle style={{ color: "#236A62" }}>
            Create a driveway posting.
          </DialogTitle>
          <form onSubmit={this.props.handleSubmit} style={style.form}>
            <div>
              <Input
                error={this.props.submitError}
                style={style.text}
                id="address"
                placeholder="Address"
                name="address"
                className={classes.textField}
              />
              <Input
                error={this.props.submitError}
                style={style.text}
                id="city"
                placeholder="City"
                name="city"
                className={classes.textField}
              />
              <Input
                error={this.props.submitError}
                style={style.text}
                id="state"
                placeholder="State"
                name="state"
                className={classes.textField}
              />
              <Input
                error={this.props.submitError}
                style={style.text}
                id="zip"
                placeholder="Zip"
                name="zip"
                className={classes.textField}
              />
            </div>

            <Select
              error={this.props.timeError || this.props.submitError}
              value={this.props.startTime}
              onChange={this.props.handleStartChange}
              inputProps={{
                name: "start",
                id: "start-hour"
              }}
              style={style.text}
              MenuProps={MenuProps}
            >
              <MenuItem value="none" disabled>
                <em>Choose a Start Time</em>
              </MenuItem>
              {hours}
            </Select>
            <Select
              error={this.props.timeError|| this.props.submitError}
              value={this.props.endTime}
              onChange={this.props.handleEndChange}
              style={style.text}
              inputProps={{
                name: "end",
                id: "end-hour"
              }}
              MenuProps={MenuProps}
            >
              <MenuItem value="none" disabled>
                <em>Choose an End Time</em>
              </MenuItem>
              {hours}
            </Select>

            <Input
              style={style.text}
              id="rateDay"
              placeholder="Daily Rate"
              name="rateDay"
              className={classes.textField}
            />
            <Input
              style={style.text}
              id="rateHour"
              placeholder="Hourly Rate"
              name="rateHour"
              className={classes.textField}
            />
            <input
              style={{ display: "none" }}
              id="driveway-image-upload"
              type="file"
              className={classes.input}
              multiple
              accept="image/*"
            />
            <div className="flexRow" style={{ marginTop: 20 }}>
              <label htmlFor="driveway-image-upload">
                <Button
                  variant="contained"
                  component="span"
                  className={classes.button}
                >
                  <InsertPhotoIcon className={classes.rightIcon} /> Upload
                </Button>
              </label>
            </div>
            <div className="flexRow" style={{ marginTop: 20 }}>
              <Button variant="contained" onClick={this.props.handleClose}>
                Close
              </Button>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </div>
            <div style={{ width: "100%", height: "40px" }} />
          </form>
        </Dialog>
      </div>
    );
  }
}

// export default withStyles(styles)(AddDriveway);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateDriveway));
