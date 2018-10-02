import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { DataService } from './services/data.service';

interface topStoriesList {
 list: [{}]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  public title = 'Hacker News App';
  private topStories: string = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
  private topStoriesIDs: topStoriesList[];
  private observableItemsList = [];
  private observableCommentsList = [];
  private finalList = [];
  private finalCommentsList = [];

  tableWidth = "100%";

  constructor(private dataService: DataService) {

  }

  ngOnInit() {
    this.getTopStoriesIDs(); //gets raw JSON data, parses it, uses ID's to get item observables, gets data from inside observable, stores it.
  }

  ngAfterViewInit() {
    this.viewFinalList(this.finalList); // View final list of data on console.
  }

  getTopStoriesIDs() {
    //First get the list of item id's
    const raw = this.dataService.getData(this.topStories);
    raw.subscribe((res: any) => {
      res.json();
      const parsed = JSON.parse(res._body);
      this.topStoriesIDs = parsed;
      //Now use each item id to get a list of item Observables
      this.getItemObservables(this.topStoriesIDs, this.observableItemsList, this.finalList);
    });
  }

  getItemObservables(list, store, finalStore) {
    list.forEach((item) => {
      const newItem = this.dataService.getData('https://hacker-news.firebaseio.com/v0/item/' + item + '.json?print=pretty')
      store.push(newItem);
    });
    //Now get the data inside each Observable
    this.getDataInsideObservable(store, finalStore)
  }

  getDataInsideObservable(list, finalStore) {
    list.forEach((observableItem) => {
      observableItem.subscribe((data) => {
        finalStore.push(JSON.parse(data._body));
      })
    })
  }

  viewFinalList(list) {
    console.log('finalList: ', list);
  }

  getComments(kids) {
    //Clear current values of lists in case anythign is stored in them.
    this.observableCommentsList = [];
    this.finalCommentsList = [];
    //Using previously created function to also extract comments
    this.getItemObservables(kids, this.observableCommentsList, this.finalCommentsList);
    //Now this.finalCommentsList can be used in the HTML to display relevant comments when a particular item is clicked.
    console.log('this.finalCommentsList: ', this.finalCommentsList);
  }

  messageReplies(kids) {
    console.log('replies ids: ', kids);
    //Gets deeply nested replies...
  }


}
