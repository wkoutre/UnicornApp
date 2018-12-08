import * as React from "react";
import { connect } from "react-redux";
import { NavigationScreenProps } from "react-navigation";
import { StyleSheet, Animated } from "react-native";
import TrackPlayer from "react-native-track-player";
import { HText, IOS, Button } from "react-native-common-lib";
import { NavLeftElement, Container } from "@common";
import { defaultRefs, WIDTH } from "@config";
import { logoutUser } from "@actions";
import { IRootState } from "@interfaces";
import { ButtonStyles, ButtonTextStyles } from "@styles";

const AUDIO_URL = `http://otrrlibrary.org/OTRRLib/Library%20Files/A%20Series/Agatha%20Christie%201/Poirots%20Christmas/AgathaChristie___PoirotsChristmas_Pt1.mp3`;

const TRACK_STATE_MAP = {
  0: "stopped",
  1: "stopped",
  2: "paused",
  3: "playing"
};

const UNICORNS = [1, 2, 3];
const TRANSLATE_INCREMENT = WIDTH / 200;
const UNICORN_FONT_SIZE = 22;
const UNICORN_OFFSET = UNICORN_FONT_SIZE + 10;

const navCommonTextProps = {
  text: "Logout",
  color: "red",
  size: 3
};

const localStyles = StyleSheet.create({
  unicorn: {
    fontSize: UNICORN_FONT_SIZE,
    position: "absolute",
    top: "30%",
    alignSelf: "flex-end"
  }
});

interface IAudioScreenProps extends NavigationScreenProps {
  logoutUser: () => void;
  user: IRootState["user"];
}

interface IAudioScreenState {
  playing: boolean;
  ready: boolean;
  duration: null | number;
}

class XAudioScreen extends React.PureComponent<
  IAudioScreenProps,
  IAudioScreenState
> {
  _translateTimer: number = 0;
  _animatedTranslate1: Animated.Value = new Animated.Value(UNICORN_OFFSET);
  _animatedTranslate2: Animated.Value = new Animated.Value(UNICORN_OFFSET * 2);
  _animatedTranslate3: Animated.Value = new Animated.Value(UNICORN_OFFSET * 3);

  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<any, any>) => {
    const localLogoutUser = navigation.getParam("logoutUser");

    return {
      gesturesEnabled: false,
      headerLeft: (
        <NavLeftElement
          disabled={!localLogoutUser}
          onPress={localLogoutUser || defaultRefs.nullFunc}
          commonTextProps={navCommonTextProps}
        />
      ),
      headerTitle: "Unicorn Media Inc."
    };
  };

  constructor(props: IAudioScreenProps) {
    super(props);

    this.state = {
      playing: false,
      ready: false,
      duration: null
    };

    this.initPlayer();
  }

  componentDidMount() {
    this.props.navigation.setParams({
      logoutUser: this.localLogout
    });
  }

  componentDidUpdate(
    prevProps: IAudioScreenProps,
    prevState: IAudioScreenState
  ) {
    const { playing } = this.state;
    const { playing: wasPlaying } = prevState;

    if (!playing && wasPlaying) {
      this.clearAnimation();
    }

    if (!wasPlaying && playing) {
      this.startAnimation();
    }
  }

  componentWillUnmount() {
    this.cleanup();
  }

  private cleanup = (): void => {
    TrackPlayer.reset();
    TrackPlayer.destroy();
    this.clearAnimation();
  };

  private localLogout = (): void => {
    this.cleanup();
    this.props.logoutUser();
  };

  private clearAnimation = (): void => {
    clearInterval(this._translateTimer);
  };

  private startAnimation = (): void => {
    this._translateTimer = setInterval(this.incrementTranslateX, 5);
  };

  private incrementTranslateX = (): void => {
    const animValues = [
      this._animatedTranslate1,
      this._animatedTranslate2,
      this._animatedTranslate3
    ];

    animValues.forEach((val, i) => {
      const { _value: animVal } = val;

      const currentValue =
        animVal >= -WIDTH ? animVal - TRANSLATE_INCREMENT : UNICORN_OFFSET;

      val.setValue(currentValue);
    });
  };

  private initPlayer = async (): Promise<void> => {
    TrackPlayer.registerEventHandler(this.audioEventTracker);
    await TrackPlayer.setupPlayer();

    const ready = await this.addTrack();
    const duration = await TrackPlayer.getDuration();

    this.setState({ ready, duration });
  };

  private addTrack = async (): Promise<boolean> => {
    try {
      await TrackPlayer.add({
        id: "unicornTrack",
        url: AUDIO_URL,
        title: "Unicorn Music",
        artist: "Unicorn LLC",
        album: "while(1<2)",
        genre: "Progressive House, Electro House",
        date: "2014-05-20T07:00:00+00:00", // RFC 3339
        artwork: "http://example.com/avaritia.png"
      });

      return true;
    } catch (err) {
      console.log(`Error adding track:`, err);

      return false;
    }
  };

  private resetPlayer = async (): Promise<void> => {
    await TrackPlayer.reset();
    await this.addTrack();
    this.handleAudioTap();
  };

  private audioEventTracker = async ({
    type,
    state
  }: {
    type: string;
    state: string;
  }) => {
    console.log(`audio event tracker:`, { type, state });

    if (type === `playback-queue-ended` && IOS) {
      this.resetPlayer();
    }
  };

  private handleAudioTap = async (): Promise<void> => {
    let trackState = await TrackPlayer.getState();

    if (typeof trackState === "number") {
      trackState = TRACK_STATE_MAP[trackState];
    }

    switch (trackState) {
      case "stopped":
      case "paused":
        this.setState({ playing: true }, TrackPlayer.play);
        break;
      case "playing":
        this.setState({ playing: false }, TrackPlayer.pause);
        break;
      default:
        break;
    }
  };

  private stopAudio = () => {
    this.setState({ playing: false }, () => {
      if (IOS) {
        TrackPlayer.stop();
      } else {
        TrackPlayer.pause();
        TrackPlayer.seekTo(0);
      }
    });
  };

  private getUnicornStyle = (n: number) => {
    const translateVal = this[`_animatedTranslate${n}`];

    return [localStyles.unicorn, { transform: [{ translateX: translateVal }] }];
  };

  private renderUnicorns = (): React.ReactNode => {
    return UNICORNS.map(n => {
      return (
        <Animated.Text
          key={n}
          transition={"translateX"}
          useNativeDriver={true}
          style={this.getUnicornStyle(n)}
        >
          🦄
        </Animated.Text>
      );
    });
  };

  render(): React.ReactNode {
    const { playing, ready } = this.state;
    const {
      user: { name }
    } = this.props;

    return (
      <Container>
        <HText
          mTpx={"5%"}
          size={5}
          text={`Welcome ${name.split(" ")[0]} to 🦄 paradise!`}
        />
        <Button
          disabled={!ready}
          mTpx={10}
          onPress={this.handleAudioTap}
          title={playing ? "Pause Music" : "Play Music"}
          backgroundColor={"blueGray50"}
          buttonStyle={ButtonStyles.full}
          commonTextProps={ButtonTextStyles.blackText}
        />
        <Button
          disabled={!ready || !playing}
          mTpx={10}
          onPress={this.stopAudio}
          title={"Stop Music"}
          backgroundColor={"red"}
          buttonStyle={ButtonStyles.full}
          commonTextProps={ButtonTextStyles.whiteText}
        />
        {this.renderUnicorns()}
      </Container>
    );
  }
}

const mapStateToProps = ({ user }: IRootState) => ({ user });

export const AudioScreen = connect(
  mapStateToProps,
  { logoutUser }
)(XAudioScreen);
