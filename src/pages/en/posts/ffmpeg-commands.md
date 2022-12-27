---
layout: ../../../layouts/MarkdownLayout.astro
title: "FFmpeg Commands"
description: "Useful commands for working with digital video"
draft: true
---

[FFmpeg](https://ffmpeg.org/) is software that helps in the processing of audio and video.
Refer to the [FFmpeg Codecs Documentation](https://ffmpeg.org/ffmpeg-codecs.html) for a complete list of supported decoders and encoders.
This tool is used to process media for the HTML `video` element (refer to the [Can I use "Video element"](https://caniuse.com/video) usage page).

In order to maintain maximum browser support, media should be available as:

* [WebM video format](https://caniuse.com/webm)
* [MPEG-4/H.264 video format](https://caniuse.com/mpeg4)
* [Ogg/Theora video format](https://caniuse.com/ogv)
* [HEVC/H.265 video format](https://caniuse.com/hevc)

Refer to the excellent [mdn web docs for additional information about web video codes](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs) or the more general [media type and format guides](https://developer.mozilla.org/en-US/docs/Web/Media/Formats).

# Transcoding

## MPEG-4/H.264

Extensions include `.mp4`, `.m4a` (audio only). Internet media types include `video/mp4` and `audio/mp4`.
Specifically, we should use this and specify `video/mp4; codecs="avc1.4d002a"`

[`x264` encoder is used for transcoding H.264 mkv files.](https://trac.ffmpeg.org/wiki/Encode/H.264)

Constant rate factor for best quality is recommended, but generates larger files.

```bash
ffmpeg -i input -c:v libx264 -preset slow -crf 20 -c:a copy output.mkv
```

* `-crf` scale ranges from 0 to 51, where 0 is lossless (for 8 bit only for 10 bit use `-qp 0`). Default is 23. 51 is the worst quality possible. Consider 17 to be nearly visually lossless.

Two-Pass rate control mode is useful for targeting a specific output size.
Given a 10 minute (600 second) long video and a desired output of 200 MiB:

```
converts MiB to kBit; note: not 8192 as 1 kBit is always 1000 bit
numkBits = 200MiB * 8388.608
numkBits / 600 seconds = ~2796 kBit/s total bitrate
```

```bash
ffmpeg -y -i input -c:v libx264 -b:v 2600k -pass 1 -an -f null /dev/null && \
ffmpeg -i input -c:v libx264 -b:v 2600k -pass 2 -c:a aac -b:a 128k output.mp4
```

### Verbose Steps for Two-Pass Rate Control

To determine the number of bits in a file, run `ls -l`. For example, `ls -l R0011671_st_orig.mp4` returns:

```
-rw-r--r--@ 1 alexander  staff  1881177697  1 Dec 09:48 R0011671_st_orig.mp4
```

Divide this number by 1000 to get number of kilobits (1000 bits).

```python
1881177697 // 1000
# 1881177
```

The length of the video in seconds can also be fetched within terminal using `ffprobe`.

```bash
ffprobe -i R0011671_st_orig.mp4 -show_entries format=duration -v quiet -of csv="p=0"
```

For me, this returns a value of `933.933333`. Therefore my target bitrate is approximately 2014.25 kilobits/second

```bash
ffmpeg -y -i R0011671_st_orig.mp4 -c:v libx264 -b:v 2600k -pass 1 -an -f null /dev/null && \
ffmpeg -i R0011671_st_orig.mp4 -c:v libx264 -b:v 2600k -pass 2 -c:a aac -b:a 128k R0011671_st.mp4
```


## WebM

[`libvpc-vp9` is the VP9 video encoder for WebM.](https://trac.ffmpeg.org/wiki/Encode/VP9)

Below is a constant quality 2-pass approach.
```bash
ffmpeg -i input.mp4 -c:v libvpx-vp9 -b:v 0 -crf 20 -pass 1 -an -f null /dev/null && \
ffmpeg -i input.mp4 -c:v libvpx-vp9 -b:v 0 -crf 20 -pass 2 -c:a libopus output.webm
```
> Note: Windows users should use NUL instead of /dev/null and ^ instead of \\.

If lossless is needed, the following may be used.
```bash
ffmpeg -i input.mp4 -c:v libvpx-vp9 -lossless 1 output.webm
```

## Ogg/Theora

Extensions include `.ogv`, `.ogg`. Internet media type is `video/ogg`.

[Theora and Vorbis](https://trac.ffmpeg.org/wiki/TheoraVorbisEncodingGuide)

A variable bitrate command is provided below.

```bash
ffmpeg -i input.mkv -codec:v libtheora -qscale:v 7 -codec:a libvorbis -qscale:a 7 output.ogv
```

* `-qscale:v` is the video quality. Range is 0-10 where 10 is the highest quality.
* `-qscale:a` is the audio quality. Range is -1.0 to 10.0 where 10.0 is highest quality.

## HEVC/H.265

Uses the [`libx265` H.265/HEVC video encoder](https://trac.ffmpeg.org/wiki/Encode/H.265).

Below is a constant rate factor command.

```bash
ffmpeg -i input -c:v libx265 -crf 26 -preset fast -c:a aac -b:a 128k output.mp4
```

# Scratch Pad

```bash
# given R0011671_st_orig.mp4, transcode compressed mp4
ffmpeg -y -i R0011671_st_orig.mp4 -c:v libx264 -b:v 2600k -pass 1 -an -f null /dev/null && \
ffmpeg -i R0011671_st_orig.mp4 -c:v libx264 -b:v 2600k -pass 2 -c:a aac -b:a 128k R0011671_st.mp4

# given R0011671_st_orig.mp4, transcode lossy webm
ffmpeg -i R0011671_st_orig.mp4 -c:v libvpx-vp9 -b:v 0 -crf 20 -pass 1 -an -f null /dev/null && \
ffmpeg -i R0011671_st_orig.mp4 -c:v libvpx-vp9 -b:v 0 -crf 20 -pass 2 -c:a libopus R0011671_st.webm

# given R0011671_st_orig.mp4, transcode lossy ogg vorbis
ffmpeg -i R0011671_st_orig.mp4 -codec:v libtheora -qscale:v 6 -codec:a libvorbis -qscale:a 6 R0011671_st.ogv

```
