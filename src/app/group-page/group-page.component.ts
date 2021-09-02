import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupsService } from '../groups.service';
import { Group, Request, Message, User } from '../types';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})
export class GroupPageComponent implements OnInit {
  isLoadingGroup: boolean = true;
  group: Group | null = null;
  messages: Message[] = [];
  requests: Request[] = [];
  user: User | null = null;

  messageValue: string = '';

  constructor(
    private groupsService: GroupsService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const groupId = this.route.snapshot.params.id;

    this.groupsService.getGroupById(groupId)
      .subscribe(group => {
        this.group = group;
        this.isLoadingGroup = false;
      });

    this.groupsService.getMessagesForGroup(groupId)
      .subscribe(messages => {
        this.messages = messages;
      });

    this.groupsService.getRequestsForGroup(groupId)
      .subscribe(requests => {
        this.requests = requests;
      });
      
    this.groupsService.getCurrentUser()
      .subscribe(user => this.user = user);
  }

  addMessage(): void {
    const groupId = this.route.snapshot.paramMap.get('id');

    this.groupsService.addMessage(groupId!, this.messageValue)
      .subscribe(updatedMessages => {
        this.messages = updatedMessages;
        this.messageValue = '';
      })
  }

  acceptRequest(requestId: string): void {
    this.groupsService.acceptRequest(requestId)
      .subscribe(updatedRequests => {
        this.requests = updatedRequests;
      });
  }

  rejectRequest(requestId: string): void {
    this.groupsService.rejectRequest(requestId)
      .subscribe(updatedRequests => {
        this.requests = updatedRequests;
      });
  }

}
