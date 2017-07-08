import { Request, ReplyNoContinue } from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { Handler } from '../../framework';
import { Credentials } from '../../../common';
import { Group, Membership } from '../../../db';

class CreateGroupHandler extends Handler {

  static validate = {
    payload: {
      name: Joi.string().required(),
      members: Joi.array().items(Joi.string()).default([])
    }
  };

  handle(request: Request, reply: ReplyNoContinue) {
    const credentials: Credentials = request.auth.credentials;
    const { name, members } = request.payload;

    // Ensure that the creator of the group is a member.
    if (members.indexOf(credentials.userid) === -1) {
      members.push(credentials.userid);
    }

    this.database.transaction(tx => {
      return tx.insert(Group, { name }).then(group => {
        if (!group) {
          reply(Boom.internal('Error creating group'));
        } else {
          const membershipProps = members.map(userid => ({
            groupid: group.id,
            userid
          }));
          return tx.insertMany(Membership, membershipProps).then(memberships => {
            if (!memberships || memberships.length === 0) {
              reply(Boom.internal('Error creating group memberships'));
            }
            reply({ group, memberships }).code(201);
          });
        }
      });
    });
  }

}

export default CreateGroupHandler;
