import { Component, OnInit } from '@angular/core';
import { GsapService } from './services/gsap.service';


export interface QuizOptions {
  optionKey: string;
  optionLabel: string;
}

export interface QuizQuestion {
  questionLabel: string;
  answerKey: string;
  options: QuizOptions[];
}

const RESULT_MESSAGE_DELAY = 3000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  score = 0;
  questions: QuizQuestion[] = [
    {
      questionLabel: 'What spell creates light at the end of the wand?',
      answerKey: 'b',
      options: [
        {
          optionKey: 'a',
          optionLabel: 'Avada Kedavra'
        },
        {
          optionKey: 'b',
          optionLabel: 'Lumos'
        },
        {
          optionKey: 'c',
          optionLabel: 'Expelliarmus'
        },
      ]
    },
    {
      questionLabel: 'What is Harry Potter\'s Birthday?',
      answerKey: 'a',
      options: [
        {
          optionKey: 'a',
          optionLabel: 'July 31st '
        },
        {
          optionKey: 'b',
          optionLabel: 'June 31st'
        },
        {
          optionKey: 'c',
          optionLabel: 'October 31st'
        }
      ]
    },
    {
      questionLabel: 'What Hogwarts House is famous for its sharp, witty students?',
      answerKey: 'c',
      options: [
        {
          optionKey: 'a',
          optionLabel: 'Hufflepuff'
        },
        {
          optionKey: 'b',
          optionLabel: 'Slytherin'
        },
        {
          optionKey: 'c',
          optionLabel: 'Ravenclaw'
        }
      ]
    }

  ];

  constructor(private gsapService: GsapService) { }

  ngOnInit() {
    // Disable scrolling
    window.addEventListener('scroll', () => { window.scrollTo(0, 0); });
  }

  reinitialize() {
    if (this.score === 0) {
      this.dismissEndMessage('#snape');
    }

    if (this.score === this.questions.length) {
      this.dismissEndMessage('#the-gang');
    }

    this.score = 0;
    this.exitTop('#ending-screen');
    this.bringToCenter('#starting-screen');
  }

  startQuiz() {
    this.exitTop('#starting-screen');
    this.bringToCenter('#question-0');
  }

  answerQuestion(selectedAnswer: string, question: QuizQuestion, index: number): void {
    //  Dismiss answered question
    this.exitTop(`#question-${index}`);

    // Prepare next index
    const nextIndex = index + 1;
    let result;

    // Determine if answer was correct
    if (selectedAnswer === question.answerKey) {
      result = '#correct-answer';
      this.score = this.score + 1;
    } else {
      result = '#incorrect-answer';
    }

    // Display result
    this.rotateEnterFromBottom(result);

    // Wait 3 seconds
    setTimeout(() => {

      // Dismiss result
      this.rotateExitToTop(result);


      // If more questions remain
      if (this.questions.length > nextIndex) {
        // Bring in next question
        this.bringToCenter(`#question-${nextIndex}`);
      } else {
        // Display end screen
        this.bringToCenter('#ending-screen');

        // Display end messages if answers were ALL correct, or ALL wrong
        if (this.score === 0) {
          this.summonEndMessage('#snape');
        } else if (this.score === this.questions.length) {
          this.summonEndMessage('#the-gang');
        }
      }
    }, RESULT_MESSAGE_DELAY);
  }

  rotateExitToTop(elementId: string): void {
    const moveUp = {
      y: -1000,
      rotate: 720,
      duration: 1.5,
      ease: 'power1.out',
      opacity: 1
    };

    const fadeout = {
      opacity: 0,
      duration: 1
    };
    // TODO Figure out how to call different durations in one call and combine these
    this.gsapService.to(elementId, moveUp);
    this.gsapService.to(elementId, fadeout);
  }

  rotateEnterFromBottom(elementId: string): void {
    const fromPosition = {
      y: 0,
      top: '110%',
      rotate: 0,
      duration: 1,
      ease: 'power1.out',
      opacity: 0,
    };

    const toPosition = {
      top: '40%',
      rotate: 360,
      duration: 1,
      ease: 'power1.out',
      opacity: 1,
    };
    this.gsapService.fromTo(elementId, fromPosition, toPosition);
  }

  exitTop(elementId: string) {
    const moveUp = {
      y: -1000,
      duration: 2
    };

    const fadeout = {
      opacity: 0,
      duration: .5
    };
    // TODO Figure out how to call different durations in one call and combine these
    this.gsapService.to(elementId, moveUp);
    this.gsapService.to(elementId, fadeout);
  }

  bringToCenter(elementId: string) {
    const fromPosition = {
      y: 0,
      top: '150%',
      duration: 1,
      opacity: 1
    };

    const toPosition = {
      top: '43%',
      duration: 1,
      opacity: 1
    };

    this.gsapService.fromTo(elementId, fromPosition, toPosition);
  }

  summonEndMessage(elementId: string) {
    const fromPosition = {
      bottom: '-1000px',
      duration: 3
    };

    const toPosition = {
      bottom: '0px',
      duration: 3
    };
    this.gsapService.fromTo(elementId, fromPosition, toPosition);
  }

  dismissEndMessage(elementId: string) {
    const fromPosition = {
      bottom: '0px',
      duration: 3
    };

    const toPosition = {
      bottom: '-1000px',
      duration: 2
    };

    this.gsapService.fromTo(elementId, fromPosition, toPosition);
  }

}
