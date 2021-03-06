import {Component, OnInit} from "@angular/core";

import {AuthService} from "../services/auth.service";
import {TweetService} from "../services/tweet.service";
import {Status} from "../classes/status";
import {Tweet} from "../classes/tweet";
import {ProfileService} from "../services/profile.service";
import {Profile} from "../classes/profile";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LikeService} from "../services/like.service";
import {Like} from "../classes/like";




@Component({
	selector: "list-tweet",
	templateUrl: "./templates/list-tweets.html"
})

export class ListTweetsComponent implements OnInit{

	createTweetForm: FormGroup;

	like : Like = new Like(null, null);

	tweet : Tweet = new Tweet (null, null, null, null);


	profile: Profile = new Profile(null,null,null,null,null);

	//declare needed state variables for latter use
	status: Status = null;

	tweets: Tweet[] = [];


	constructor(  private authService : AuthService , private formBuilder: FormBuilder, private profileService: ProfileService, private likeService : LikeService, private tweetService: TweetService ) {}

	//life cycling before my eyes
	ngOnInit() : void {
		this.listTweets();

		this.createTweetForm = this.formBuilder.group({
			tweetContent: ["",[Validators.maxLength(140), Validators.minLength(1), Validators.required]]
		});
	}

	getTweetProfile(): void {
		this.profileService.getProfile(this.tweet.tweetProfileId)
	}


	listTweets(): void {
		this.tweetService.getAllTweets()
			.subscribe(tweets => this.tweets = tweets);
	}
	createTweet(): void  {

		let tweet = new Tweet(null, null, this.createTweetForm.value.tweetContent, null);

		this.tweetService.createTweet(tweet)
			.subscribe(status =>{
				this.status = status;
				if(this.status.status ===200) {
					this.createTweetForm.reset();
					alert(this.status.message);
					this.listTweets();
				}
			});
	}


	createLike(tweetId : string) : void {

		//let like : Like = new Like(profileId, tweetId);

		console.log( this.authService.decodeJwt() );

		this.likeService.createLike(this.like)
			.subscribe(
			status => {
				this.status = status;
				if(this.status.status === 200) {
					console.log("success");
				}
			});

	}


}