import React, { PropTypes } from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
import { Button } from 'react-bootstrap';
import { Actions } from 'meteor/nova:base-components';

import Experiment from 'react-ab-test/lib/Experiment';
import Variant from 'react-ab-test/lib/Variant';
import emitter from 'react-ab-test/lib/emitter';
import experimentDebugger from 'react-ab-test/lib/debugger';

import Core from 'meteor/nova:core';
const Messages = Core.Messages;

const Input = FRC.Input;

experimentDebugger.enable();

emitter.addPlayListener(function(experimentName, variantName) {
  console.log(`Start experiment ‘${experimentName}’ variant ‘${variantName}’`);
  Meteor.call('abtests.play', experimentName, variantName);
});

emitter.addWinListener(function(experimentName, variantName) {
  console.log(`Variant ‘${variantName}’ of experiment ‘${experimentName}’ was clicked`);
  Meteor.call('abtests.win', experimentName, variantName);
});

class CustomNewsletterForm extends Telescope.components.NewsletterForm {
  // For testing purposes
  constructor(props, context) {
    super(props, context);

    console.log(context.currentUser)

    this.state = {
      showBanner: true
    };
  }

  emitWin() {
    this.refs.experiment.win();
  }

  subscribeEmail(data) {
    Actions.call("addEmailToMailChimpList", data.email, (error, result) => {
      if (error) {
        console.log(error)
        Messages.flash(error.message, "error");
      } else {
        Messages.flash(this.props.successMessage, "success");
        this.emitWin(); // emit win when subscription is successful
        this.dismissBanner();
      }
    });
  }

  subscribeUser() {
    Actions.call("addCurrentUserToMailChimpList", (error, result) => {
      if (error) {
        console.log(error)
        Messages.flash(error.message, "error");
      } else {
        Messages.flash(this.props.successMessage, "success");
        this.emitWin(); // emit win when subscription is successful
        this.dismissBanner();
      }
    });
  }

  // // For testing purposes
  // subscribeEmail(data) {
  //   Messages.flash(this.props.successMessage, 'success');
  //   this.emitWin();
  //   this.dismissBanner();
  // }
  //
  // // For testing purposes
  // subscribeUser() {
  //   Messages.flash(this.props.successMessage, 'success');
  //   this.emitWin();
  //   this.dismissBanner();
  // }

  renderForm(labelText, buttonText) {
    return (
      <Formsy.Form className="newsletter-form" onSubmit={this.subscribeEmail}>
        <Input
          name="email"
          value=""
          placeholder={labelText}
          type="text"
          layout="elementOnly"
        />
        <Button type="submit" bsStyle="primary">{buttonText}</Button>
      </Formsy.Form>
    )
  }

  renderButton(buttonText) {
    return (
      <Button className="newsletter-button" onClick={this.subscribeUser} bsStyle="primary">{buttonText}</Button>
    )
  }

  renderComponent(headerText, labelText, buttonText) {
    return (
      <div className="newsletter">
        <h4 className="newsletter-tagline">{headerText}</h4>
        {this.context.currentUser ? this.renderButton(buttonText) : this.renderForm(labelText, buttonText)}
        <a onClick={this.dismissBanner} className="newsletter-close"><Icon name="close"/></a>
      </div>
    );
  }

  render() {
    ({Icon} = Telescope.components);

    if (Meteor.isClient && this.state.showBanner) {
      return (
        <Experiment ref="experiment" name="Newsletter Form Experiment">
          <Variant name="A">
            {this.renderComponent(this.props.headerText, this.props.labelText, this.props.buttonText)}
          </Variant>
          <Variant name="B">
            {this.renderComponent('Receive the latest design news in your inbox', 'Your email', 'Subscribe')}
          </Variant>
        </Experiment>
      );
    } else {
      return null;
    }
  }
}

Telescope.components.NewsletterForm = CustomNewsletterForm;
